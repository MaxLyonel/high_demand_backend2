// framework nestjs
import { Inject, Injectable } from "@nestjs/common";
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
    @Inject('APP_CONSTANTS') private readonly constants,
    private readonly highDemandRepository: HighDemandRepository,
    private readonly workflowRepository: WorkflowRepository,
    private readonly historyRepository: HistoryRepository,
    private readonly workflowSequenceRepository: WorkflowSequenceRepository,
    private readonly educationalInstitutionRepository: EducationalInstitutionRepository,
    private readonly operativeRepository: OperationsProgrammingRepository
  ) {}

  // ****** Guardar la Alta Demanda *******
  async saveHighDemandRegistration(obj: HighDemandRegistration, coursesParam: any): Promise<HighDemandRegistration> {

    const { CURRENT_YEAR } = this.constants
    const workflow = await this.workflowRepository.findLastActive()
    if(!workflow) throw new Error("No se puede crear la Alta Demanda, falta definir el flujo")

    const workflowStates = await this.workflowSequenceRepository.getOrderedFlowStates()
    if(workflowStates.length <= 0) throw new Error("No se puede crear la Alta Demanda, falta definir las secuencias")

    const operative = await this.operativeRepository.getOperative(CURRENT_YEAR)
    if(!operative) throw new Error("Aún no se definio las fechas para el operativo")

    const firstWorkflowState = workflowStates[0]

    // buscamos su distrito
    const ditrictFound = await this.educationalInstitutionRepository.searchEducationalInstitutionDistrict(obj.educationalInstitutionId)
    const { jurisdiction } = ditrictFound
    obj.placeDistrict = jurisdiction.districtPlaceType

    const existingRegistrations = await this.highDemandRepository.findInscriptions(obj)


    if(obj.rolId === this.constants.ROLES.VER_ROLE) {
      obj.rolId = this.constants.ROLES.VER_ROLE
      obj.registrationStatus =RegistrationStatus.APPROVED
    } else {
      obj.registrationStatus =RegistrationStatus.REGISTER
      obj.rolId = firstWorkflowState.currentState
    }

    // obj.registrationStatus = RegistrationStatus.REGISTER
    // obj.rolId = firstWorkflowState.currentState
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

    if(obj.rolId === this.constants.ROLES.VER_ROLE) {
      const newHistory = {
        highDemandRegistrationId: saved.id,
        workflowStateId: saved.workflowStateId,
        registrationStatus: saved.registrationStatus,
        userId: saved.userId,
        rolId: saved.rolId,
        observation: 'Postulación aprovada por el Técnico del Viceministerio de Educación Regular'
      }
      this.historyRepository.updatedHistory(newHistory)
    } else {
      const newHistory = {
        highDemandRegistrationId: saved.id,
        workflowStateId: saved.workflowStateId,
        registrationStatus: saved.registrationStatus,
        userId: saved.userId,
        rolId: saved.rolId,
        observation: ''
      }
      this.historyRepository.updatedHistory(newHistory)
    }
    return saved
  }

  async editHighDemandRegistration(obj: any): Promise<any> {
    const { highDemand  } = obj
    if(highDemand.workflowStateId === 1 && highDemand.registrationStatus === RegistrationStatus.REGISTER ) {
      const edited = await this.highDemandRepository.editHighDemandRegistration(obj)
      return edited
    }
    throw new Error("No puede editar la alta demanda")
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

  async gethighDemandForVER(institutionId: number): Promise<any> {
    let message = ''
    const highDemand = await this.highDemandRepository.findByInstitutionIdWithDeletedAt(institutionId)
    if(!highDemand) {
      message = 'No se encontró la postulación de la unida educativa. ¿Postular UE como omisión?'
      return {
        canCreate: true,
        highDemand: null,
        message
      }
    }
    if(highDemand.registrationStatus === RegistrationStatus.APPROVED) {
      message = 'La postulación de la unidad educativa ya fue aprovada'
      return {
        canCreate: false,
        highDemand,
        message
      }
    }
    if(highDemand.registrationStatus === RegistrationStatus.CANCELED) {
      message = 'La postulación de la unidad educativa fue anulada por el director'
      return {
        canCreate: true,
        highDemand: null,
        message
      }
    }
    if(highDemand.rolId == 37 && highDemand.workflowStateId == 1) {
      message = 'La postulación de la unidad educativa no fue recepcionada por el Distrital'
      return {
        canCreate: true,
        highDemand,
        message
      }
    }
    if(highDemand.rolId == 37 && highDemand.workflowStateId == 2) {
      message = 'La postulación de la unidad educativa fue recepcionada pero no derivada'
      return {
        canCreate: true,
        highDemand,
        message
      }
    }
    if(highDemand.rolId == 850 && highDemand.workflowStateId == 1) {
      message = 'La postulación de la unidad educativa no fue recepcionada por el Departamental'
      return {
        canCreate: true,
        highDemand,
        message
      }
    }
    if(highDemand.rolId == 850 && highDemand.workflowStateId == 2) {
      message = 'La postulación de la unidad educativa no fue aprobada por el departamental'
      return {
        canCreate: true,
        highDemand,
        message
      }
    }
  }

  // ****** Listar Altas Demandas Aprobadas *****
  async listHighDemandsApproved(departmentId: number): Promise<any[]> {
    const highDemandsApproved = await this.highDemandRepository.getHighDemandsApproved(departmentId)
    return highDemandsApproved
  }

  // ****** Obtener Alta Demanda Registrada *****
  async getHighDemandRegistered(highDemandId: number): Promise<any> {
    const highDemandAproved = await this.highDemandRepository.getHighDemandRegistered(highDemandId)
    return highDemandAproved
  }

  async getHighDemandLevels(obj: any): Promise<any> {
    const highDemand = await this.highDemandRepository.getHighDemandLevels(obj)
    const grouped = highDemand.courses.reduce((acc: any, item: any) => {
      if(!acc[item.level.id]) {
        acc[item.level.id] = {
          id: item.level.id,
          name: item.level.name,
          grades: {}
        }
      }
      const level = acc[item.level.id];
      if(!level.grades[item.grade.id]) {
        level.grades[item.grade.id] = {
          id: item.grade.id,
          name: item.grade.name,
          courseId: item.id,
          parallels: [],
        }
      }

      const grade = level.grades[item.grade.id];

      const existsParallel = grade.parallels.find((p: any) => p.id === item.parallel.id);
      if(!existsParallel) {
        grade.parallels.push({
          id: item.parallel.id,
          name: item.parallel.name,
          totalQuota: item.totalQuota,
          courseId: item.id
        })
      }
      return acc;
    }, {} as any)
    const result = Object.values(grouped).map((level: any) => ({
      ...level,
      grades: Object.values(level.grades).map((grade: any) => ({
        ...grade,
        parallels: grade.parallels
      })),
    }));
    return result
  }
}