// framework nestjs
import { Inject, Injectable } from "@nestjs/common";
// own implementations
import { EducationalInstitution } from "../../domain/models/educational-institution.model";
import { HighDemandRegistration } from "../../domain/models/high-demand-registration.model";
import { HighDemandRegistrationEntity } from "@high-demand/infrastructure/adapters/secondary/persistence/entities/high-demand.entity";
import { HighDemandRepository } from "../../domain/ports/outbound/high-demand.repository";
import { HighDemandService } from "../../domain/ports/inbound/high-demand.service";
import { RegistrationStatus } from "@high-demand/domain/enums/registration-status.enum";
import { WorkflowRepository } from "@high-demand/domain/ports/outbound/workflow.repository";
import { WorkflowStateRepository } from "@high-demand/domain/ports/outbound/workflow-state.repository";
import { HistoryRepository } from "@high-demand/domain/ports/outbound/history.repository";
import { CreateHistoryDto } from "../dtos/create-history.dto";
import { DataSource } from "typeorm";
import { HighDemandCourseRepository } from "@high-demand/domain/ports/outbound/high-demand-course.repository";


@Injectable()
export class HighDemandRegistrationImpl implements HighDemandService {
  constructor(
    private readonly highDemandRepository: HighDemandRepository,
    private readonly workflowRepository: WorkflowRepository,
    private readonly workflowStateRepository: WorkflowStateRepository,
    private readonly historyRepository: HistoryRepository,
    private readonly highDemandCourseRepository: HighDemandCourseRepository,
    @Inject('DATA_SOURCE') private readonly dataSource: DataSource
  ) {}

  async saveHighDemandRegistration(obj: HighDemandRegistration): Promise<HighDemandRegistration> {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    const workflow = await this.workflowRepository.findLastActive()
    const workflowState = await this.workflowStateRepository.findByName('BORRADOR')
    //! la pregunta es como obtenemos el 2025?
    // const operative = await this.operativeRepository.findOne(2025)
    // buscar registros previos de esa institución en ese operativo
    const existingRegistrations = await this.highDemandRepository.findInscriptions(obj)
    try {
      // Paso 1: Configuracion del objeto
      obj.registrationStatus = RegistrationStatus.PENDING
      obj.workflowStateId = workflowState.id
      obj.workflowId = workflow ? workflow.id : 1
      obj.inbox = true
      obj.operativeId = 1 // ! importante: debe estar esto en el seeder

      // Paso 2: aplicar la lógica del dominio
      const domain = HighDemandRegistration.create({
        ...obj,
        existingRegistrations
      });

      // Paso 3: convertir a entidad y guardar
      const entity = HighDemandRegistrationEntity.fromDomain(domain);
      const saved = await this.highDemandRepository.saveHighDemandRegistration(entity)

      // Paso 4: guardar sus cursos
      const { courses } = obj
      const { id: highDemandId } = saved
      this.highDemandCourseRepository.saveHighDemandCourse(highDemandId, courses)

      // Paso 5: Registramos en su historial
      const newHistory = {
        highDemandRegistrationId: saved.id,
        workflowStateId: saved.workflowStateId,
        registrationStatus: saved.registrationStatus,
        userId: saved.userId,
        observation: ''
      }
      this.historyRepository.updatedHistory(newHistory)
      return saved
    } catch(error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  async modifyWorkflowStatus(obj: CreateHistoryDto): Promise<HighDemandRegistration> {
    const updatedHighDemand = await this.highDemandRepository.updateWorkflowStatus(obj)
    return updatedHighDemand
  }

  async getHighDemandRegistration(educationalInstitutionId: number): Promise<HighDemandRegistration | null> {
    const highDemand = await this.highDemandRepository.findByInstitutionId(educationalInstitutionId)
    return highDemand
  }

  cancelHighDemands(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  listHighDemands(): Promise<EducationalInstitution[]> {
    throw new Error("Method not implemented.");
  }
  modifyHighDemand(): Promise<HighDemandRegistration> {
    throw new Error("Method not implemented.");
  }
  changeHighDemandStatus(): Promise<any> {
    throw new Error("Method not implemented.");
  }


}