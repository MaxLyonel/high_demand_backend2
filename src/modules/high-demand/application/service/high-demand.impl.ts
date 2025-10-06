// framework nestjs
import { Injectable } from "@nestjs/common";
// own implementations
import { HighDemandRegistration } from "../../domain/models/high-demand-registration.model";
import { HighDemandRegistrationEntity } from "@high-demand/infrastructure/adapters/secondary/persistence/entities/high-demand.entity";
import { HighDemandRepository } from "../../domain/ports/outbound/high-demand.repository";
import { HighDemandService } from "../../domain/ports/inbound/high-demand.service";
import { RegistrationStatus } from "@high-demand/domain/enums/registration-status.enum";
import { WorkflowRepository } from "@high-demand/domain/ports/outbound/workflow.repository";
import { HistoryRepository } from "@high-demand/domain/ports/outbound/history.repository";
import { CreateHistoryDto } from "../dtos/create-history.dto";
import { WorkflowSequenceRepository } from "@high-demand/domain/ports/outbound/workflow-sequence.repository";
import { EducationalInstitutionRepository } from "@high-demand/domain/ports/outbound/educational-institution.repository";
import { OperationsProgrammingRepository } from "src/modules/operations-programming/domain/ports/outbound/operations-programming.repository";
import { HighDemandRegistrationCourse } from "@high-demand/domain/models/high-demand-registration-course.model";


@Injectable()
export class HighDemandRegistrationImpl implements HighDemandService {
  constructor(
    private readonly highDemandRepository: HighDemandRepository,
    private readonly workflowRepository: WorkflowRepository,
    private readonly historyRepository: HistoryRepository,
    private readonly workflowSequenceRepository: WorkflowSequenceRepository,
    private readonly educationalInstitutionRepository: EducationalInstitutionRepository,
    private readonly operativeRepository: OperationsProgrammingRepository
  ) {}

  // ****** Guardar la Alta Demanda *******
  async saveHighDemandRegistration(obj: HighDemandRegistration, coursesParam: any): Promise<HighDemandRegistration> {

    const workflow = await this.workflowRepository.findLastActive()
    if(!workflow) throw new Error("No se puede crear la Alta Demanda, falta definir el flujo")

    const workflowStates = await this.workflowSequenceRepository.getOrderedFlowStates()
    if(workflowStates.length <= 0) throw new Error("No se puede crear la Alta Demanda, falta definir las secuencias")

    const operative = await this.operativeRepository.getOperative(2025)
    if(!operative) throw new Error("Aún no se definio las fechas para el operativo")

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

    const highDemandCourses = coursesParam.map((c, index) =>
      HighDemandRegistrationCourse.create({
        id: c.id ?? null,
        highDemandRegistrationId: obj.id ?? 0,
        levelId: c.levelId,
        gradeId: c.gradeId,
        parallelId: c.parallelId,
        totalQuota: c.totalQuota,
        existingCourses: coursesParam.slice(0, index)
      })
    )

    const domain = HighDemandRegistration.create({
      ...obj,
      courses: highDemandCourses,
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
    const updatedHighDemand = await this.highDemandRepository.updateWorkflowStatus(obj)
    return updatedHighDemand
  }

  async getHighDemandRegistration(educationalInstitutionId: number): Promise<HighDemandRegistration | null> {
    const highDemand = await this.highDemandRepository.findByInstitutionId(educationalInstitutionId)
    return highDemand
  }

  // ****** Listar Altas Demandas Aprobadas *****
  async listHighDemandsApproved(departmentId: number): Promise<any[]> {
    const highDemandsApproved = await this.highDemandRepository.getHighDemandsApproved(departmentId)
    return highDemandsApproved
  }
}