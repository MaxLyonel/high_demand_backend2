// framework nestjs
import { Injectable } from "@nestjs/common";
// own implementations
import { HighDemandRegistration } from "../../domain/models/high-demand-registration.model";
import { HighDemandRegistrationEntity } from "@high-demand/infrastructure/adapters/secondary/persistence/entities/high-demand.entity";
import { HighDemandRepository } from "../../domain/ports/outbound/high-demand.repository";
import { HighDemandService } from "../../domain/ports/inbound/high-demand.service";
import { RegistrationStatus } from "@high-demand/domain/enums/registration-status.enum";
import { WorkflowRepository } from "@high-demand/domain/ports/outbound/workflow.repository";
import { WorkflowStateRepository } from "@high-demand/domain/ports/outbound/workflow-state.repository";
import { HistoryRepository } from "@high-demand/domain/ports/outbound/history.repository";
import { CreateHistoryDto } from "../dtos/create-history.dto";
import { HighDemandCourseRepository } from "@high-demand/domain/ports/outbound/high-demand-course.repository";
import { WorkflowSequenceRepository } from "@high-demand/domain/ports/outbound/workflow-sequence.repository";
import { RolRepository } from "@access-control/application/ports/outbound/rol.repository";
import { UserRepository } from '../../../access-control/application/ports/outbound/user.repository';
import { EducationalInstitutionRepository } from "@high-demand/domain/ports/outbound/educational-institution.repository";


@Injectable()
export class HighDemandRegistrationImpl implements HighDemandService {
  constructor(
    private readonly highDemandRepository: HighDemandRepository,
    private readonly workflowRepository: WorkflowRepository,
    private readonly workflowStateRepository: WorkflowStateRepository,
    private readonly historyRepository: HistoryRepository,
    private readonly highDemandCourseRepository: HighDemandCourseRepository,
    private readonly workflowSequenceRepository: WorkflowSequenceRepository,
    private readonly rolRepository: RolRepository,
    private readonly userRepository: UserRepository,
    private readonly educationalInstitutionRepository: EducationalInstitutionRepository
  ) {}

  // ****** Guardar la Alta Demanda *******
  async saveHighDemandRegistration(obj: HighDemandRegistration, coursesParam: any): Promise<HighDemandRegistration> {

    const workflow = await this.workflowRepository.findLastActive()
    if(!workflow) {
      throw new Error("No se puede crear la Alta Demanda, falta definir el flujo")
    }
    const workflowState = await this.workflowStateRepository.findByName('BORRADOR')
    if(!workflowState) {
      throw new Error("No se puede crear la Alta Demanda, falta los estados del flujo")
    }

    const existingRegistrations = await this.highDemandRepository.findInscriptions(obj)
    obj.registrationStatus = RegistrationStatus.PENDING
    obj.workflowStateId = workflowState.id
    obj.workflowId = workflow!.id
    obj.inbox = true
    obj.operativeId = 1 // ! importante: debe estar esto en el seeder

    const domain = HighDemandRegistration.create({
      ...obj,
      courses: coursesParam,
      existingRegistrations
    });

    const entity = HighDemandRegistrationEntity.fromDomain(domain);
    const saved = await this.highDemandRepository.saveHighDemandRegistration(entity)

    const { id: highDemandId } = saved
    this.highDemandCourseRepository.saveHighDemandCourse(highDemandId, coursesParam)

    const newHistory = {
      highDemandRegistrationId: saved.id,
      workflowStateId: saved.workflowStateId,
      registrationStatus: saved.registrationStatus,
      userId: saved.userId,
      observation: ''
    }
    this.historyRepository.updatedHistory(newHistory)
    return saved
  }

  // ****** Registrar la Alta Demanda ******
  async sendHighDemand(obj: any): Promise<HighDemandRegistration> {
    const { workflowStateId, rolId } = obj
    // buscar su siguiente estado
    const workflowSequence = await this.workflowSequenceRepository.findNextState(rolId, workflowStateId)
    const { destinyState, rolId: nextRolId } = workflowSequence
    // actualizar la alta demanda
    obj.workflowStateId = destinyState
    obj.rolId = nextRolId
    obj.inbox = false
    const entity = HighDemandRegistrationEntity.fromDomain(obj)
    const saved = await this.highDemandRepository.saveHighDemandRegistration(entity)
    // actualizar su historial
    const newHistory = {
      highDemandRegistrationId: saved.id,
      workflowStateId: saved.workflowStateId,
      registrationStatus: saved.registrationStatus,
      userId: saved.userId,
      observation: ''
    }
    this.historyRepository.updatedHistory(newHistory)
    return saved
  }

  // ****** Recibir la Alta Demanda *****
  async receiveHighDemand(id: number): Promise<any> {

    const highDemand = await this.highDemandRepository.updatedInbox(id)

    const newHistory = {
      highDemandRegistrationId: highDemand.id,
      workflowStateId: highDemand.workflowStateId,
      registrationStatus: highDemand.registrationStatus,
      userId: highDemand.userId,
      observation: ''
    }
    this.historyRepository.updatedHistory(newHistory)
    return highDemand
  }


  async modifyWorkflowStatus(obj: CreateHistoryDto): Promise<HighDemandRegistration> {
    // 1: buscamos su estado siguiente

    // 2: Actualizamos el estado del tramite
    //  - rolId, estado_id
    // const workflowSequence = await this.workflowStateRepository.findByRolId(obj.rolId, workflowState.id)
    const updatedHighDemand = await this.highDemandRepository.updateWorkflowStatus(obj)
    return updatedHighDemand
  }

  async getHighDemandRegistration(educationalInstitutionId: number): Promise<HighDemandRegistration | null> {
    const highDemand = await this.highDemandRepository.findByInstitutionId(educationalInstitutionId)
    return highDemand
  }

  // ****** Listar Altas Demandas de la Bandeja de Entrada ******
  async listInbox(rolId: number, stateId: number): Promise<any[]> {
    const highDemands = await this.highDemandRepository.searchByInbox(rolId, stateId)
    const reducer:any = []
    for(let highDemand of highDemands) {
      const { educationalInstitutionId, userId, workflowStateId, rolId } = highDemand
      const workflowState = await this.workflowStateRepository.findById(workflowStateId)
      const rol = await this.rolRepository.findById(rolId)
      const user = await this.userRepository.findById(userId)
      const institution = await this.educationalInstitutionRepository.findBySie(educationalInstitutionId)
      const obj = {
        id: highDemand.id,
        workflowId: highDemand.workflowId,
        inbox: highDemand.inbox,
        operativeId: highDemand.operativeId,
        registrationStatus: highDemand.registrationStatus,
        workflowState,
        rol,
        user,
        institution
      }
      reducer.push(obj)
    }
    return reducer
  }

  async listReceived(rolId: number, stateId: number): Promise<any[]> {
    const highDemands = await this.highDemandRepository.searchByReceived(rolId, stateId)
    const reducer:any = []
    for(let highDemand of highDemands) {
      const { educationalInstitutionId, userId, workflowStateId, rolId } = highDemand
      const workflowState = await this.workflowStateRepository.findById(workflowStateId)
      const rol = await this.rolRepository.findById(rolId)
      const user = await this.userRepository.findById(userId)
      const institution = await this.educationalInstitutionRepository.findBySie(educationalInstitutionId)
      const obj = {
        id: highDemand.id,
        workflowId: highDemand.workflowId,
        inbox: highDemand.inbox,
        operativeId: highDemand.operativeId,
        registrationStatus: highDemand.registrationStatus,
        workflowState,
        rol,
        user,
        institution
      }
      reducer.push(obj)
    }
    return reducer
  }
}