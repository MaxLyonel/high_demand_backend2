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
import { WorkflowSequenceRepository } from "@high-demand/domain/ports/outbound/workflow-sequence.repository";
import { RolRepository } from "@access-control/domain/ports/outbound/rol.repository";
import { UserRepository } from '@access-control/domain/ports/outbound/user.repository';
import { EducationalInstitutionRepository } from "@high-demand/domain/ports/outbound/educational-institution.repository";
import { OperationsProgrammingRepository } from "src/modules/operations-programming/domain/ports/outbound/operations-programming.repository";


@Injectable()
export class HighDemandRegistrationImpl implements HighDemandService {
  constructor(
    private readonly highDemandRepository: HighDemandRepository,
    private readonly workflowRepository: WorkflowRepository,
    private readonly workflowStateRepository: WorkflowStateRepository,
    private readonly historyRepository: HistoryRepository,
    private readonly workflowSequenceRepository: WorkflowSequenceRepository,
    private readonly rolRepository: RolRepository,
    private readonly userRepository: UserRepository,
    private readonly educationalInstitutionRepository: EducationalInstitutionRepository,
    private readonly operativeRepository: OperationsProgrammingRepository
  ) {}

  // ****** Guardar la Alta Demanda *******
  async saveHighDemandRegistration(obj: HighDemandRegistration, coursesParam: any): Promise<HighDemandRegistration> {

    const workflow = await this.workflowRepository.findLastActive()
    if(!workflow) {
      throw new Error("No se puede crear la Alta Demanda, falta definir el flujo")
    }
    const workflowStates = await this.workflowSequenceRepository.getOrderedFlowStates()
    if(workflowStates.length <= 0) {
      throw new Error("No se puede crear la Alta Demanda, falta definir las secuencias")
    }
    const operative = await this.operativeRepository.getOperative(2025)
    if(!operative) {
      throw new Error("Aún no se definio las fechas para el operativo")
    }
    const firstWorkflowState = workflowStates[0]

    // buscamos su distrito
    const ditrictFound = await this.educationalInstitutionRepository.searchEducationalInstitutionDistrict(obj.educationalInstitutionId)
    const { jurisdiction } = ditrictFound
    obj.placeDistrict = jurisdiction.districtPlaceType

    const existingRegistrations = await this.highDemandRepository.findInscriptions(obj)
    obj.registrationStatus = RegistrationStatus.REGISTER
    obj.rolId = firstWorkflowState.currentState
    obj.workflowStateId = 2 //TODO
    obj.workflowId = workflow.id
    obj.inbox = false
    obj.operativeId = operative.id

    const domain = HighDemandRegistration.create({
      ...obj,
      courses: coursesParam,
      existingRegistrations
    });

    const saved = await this.highDemandRepository.saveHighDemandRegistration(domain)

    const newHistory = {
      highDemandRegistrationId: saved.id,
      workflowStateId: saved.workflowStateId,
      registrationStatus: saved.registrationStatus,
      userId: saved.userId,
      rolId: saved.rolId,
      observation: ''
    }
    this.historyRepository.updatedHistory(newHistory)
    return saved
  }

  // ****** Registrar la Alta Demanda ******
  async sendHighDemand(obj: any): Promise<HighDemandRegistration> {
    const { rolId } = obj
    const workflowSequence = await this.workflowSequenceRepository.findNextStates(rolId)
    const { nextState } = workflowSequence[0]
    obj.rolId = nextState
    obj.workflowStateId = 1
    obj.inbox = false
    const entity = HighDemandRegistrationEntity.fromDomain(obj)
    const saved = await this.highDemandRepository.saveHighDemandRegistration(entity)
    const newHistory = {
      highDemandRegistrationId: saved.id,
      workflowStateId: saved.workflowStateId,
      registrationStatus: saved.registrationStatus,
      userId: saved.userId,
      rolId: saved.rolId,
      observation: ''
    }
    this.historyRepository.updatedHistory(newHistory)
    return saved
  }

  // ** Obtener los roles a donde ir **
  async getRolesToGo(rolId: number): Promise<any> {
    const workflowSequences = await this.workflowSequenceRepository.findNextStates(rolId)
    return workflowSequences
  }

  // ****** Recibir la Alta Demanda *****
  async receiveHighDemand(id: number, userId: number): Promise<any> {
    const highDemandFound = await this.highDemandRepository.findById(id)
    if(!highDemandFound) throw new Error('No existe la alta demanda')

    const saved = await this.highDemandRepository.updatedInbox(highDemandFound.id, 2)

    const newHistory = {
      highDemandRegistrationId: saved.id,
      workflowStateId: saved.workflowStateId,
      registrationStatus: saved.registrationStatus,
      userId: userId,
      rolId: saved.rolId,
      observation: ''
    }
    this.historyRepository.updatedHistory(newHistory)
    return highDemandFound
  }

  // ** Derivar alta demanda **
  async deriveHighDemand(obj: any, rolId: number, observation: string | null): Promise<any> {
    const saved = await this.highDemandRepository.deriveHighDemand(obj.id, rolId)
    const newHistory = {
      highDemandRegistrationId: saved.id,
      workflowStateId: saved.workflowStateId,
      registrationStatus: saved.registrationStatus,
      userId: saved.userId,
      rolId: saved.rolId,
      observation: observation
    }
    this.historyRepository.updatedHistory(newHistory)
    return saved
  }

  // ** aprobar alta demanda **
  async approveHighDemand(obj: any): Promise<any> {
    const saved = await this.highDemandRepository.approveHighDemand(obj.id, RegistrationStatus.APPROVED)
    const newHistory = {
      highDemandRegistrationId: saved.id,
      workflowStateId: saved.workflowStateId,
      registrationStatus: saved.registrationStatus,
      userId: saved.userId,
      rolId: saved.rolId,
      observation: ''
    }
    this.historyRepository.updatedHistory(newHistory)
    return saved
  }

  // ** rechazar alta demanda **
  async declineHighDemand(obj: any): Promise<any> {
    const saved = await this.highDemandRepository.declinehighDemand(obj.id, RegistrationStatus.REJECTED)
    const newHistory = {
      highDemandRegistrationId: saved.id,
      workflowStateId: saved.workflowStateId,
      registrationStatus: saved.registrationStatus,
      userId: saved.userId,
      rolId: saved.rolId,
      observation: ''
    }
    this.historyRepository.updatedHistory(newHistory)
    return saved
  }

  // ** modificar estado inscripción alta demanda **
  async cancelHighDemand(obj: any): Promise<any> {
    const updated = await this.highDemandRepository.cancelHighDemand(obj, RegistrationStatus.CANCELED)
    const newHistory = {
      highDemandRegistrationId: updated.id,
      workflowStateId: updated.workflowStateId,
      registrationStatus: updated.registrationStatus,
      userId: updated.userId,
      rolId: updated.rolId,
      observation: 'Inscripción de Alta Demanda anulada por el director'
    }
    this.historyRepository.updatedHistory(newHistory)
    return updated
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
  async listInbox(rolId: number, stateId: number, placeTypeId: number): Promise<any[]> {
    let placeTypes:Array<number> = []
    switch(parseInt(rolId.toString())) {
      case 37: // distrital
        placeTypes.push(placeTypeId)
        break;
      case 38: // departamental
        const places = await this.highDemandRepository.searchChildren(placeTypeId)
        placeTypes = places.map(p => p.id)
        break;
    }
    const highDemands = await this.highDemandRepository.searchInbox(rolId, stateId, placeTypes)
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
        institution,
        courses: highDemand.courses
      }
      reducer.push(obj)
    }
    return reducer
  }

  // ****** Listar Altas Demandas de la Bandeja de Recibidos *****
  async listReceived(rolId: number, placeTypeId: number): Promise<any[]> {
    let placeTypes:Array<number> = []
    switch(parseInt(rolId.toString())) {
      case 37:
        placeTypes.push(placeTypeId)
        break;
      case 38:
        const places = await this.highDemandRepository.searchChildren(placeTypeId)
        placeTypes = places.map(p => p.id)
        break;
    }
    const highDemands = await this.highDemandRepository.searchReceived(rolId, placeTypes)
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
        institution,
        courses: highDemand.courses
      }
      reducer.push(obj)
    }
    return reducer
  }

  // ****** Listar Altas Demandas Aprobadas *****
  async listHighDemandsApproved(): Promise<any[]> {
    const highDemandsApproved = await this.highDemandRepository.getHighDemandsApproved()
    return highDemandsApproved
  }
}