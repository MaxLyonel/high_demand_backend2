// framework nestjs
import { Injectable } from "@nestjs/common";
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


@Injectable()
export class HighDemandRegistrationImpl implements HighDemandService {
  constructor(
    private readonly highDemandRepository: HighDemandRepository,
    private readonly workflowRepository: WorkflowRepository,
    private readonly workflowStateRepository: WorkflowStateRepository,
    private readonly historyRepository: HistoryRepository
  ) {}

  async saveHighDemandRegistration(obj: HighDemandRegistration): Promise<HighDemandRegistration> {

    const workflow = await this.workflowRepository.findLastActive()
    const workflowState = await this.workflowStateRepository.findByName('BORRADOR')
    // Paso 1: Configuracion del objeto
    obj.registrationStatus = RegistrationStatus.PENDING
    obj.workflowStateId = workflowState.id
    obj.workflowId = workflow ? workflow.id : 1
    obj.inbox = true
    obj.operativeId = 1 // ! importante: debe estar esto en el seeder
    // Paso 1: buscar registros previos de esa institución en ese operativo
    const existingRegistrations = await this.highDemandRepository.findInscriptions(obj)

    // Paso 2: aplicar la lógica del dominio
    const domain = HighDemandRegistration.create({
      ...obj,
      existingRegistrations
    });

    // Paso 3: convertir a entidad y guardar
    const entity = HighDemandRegistrationEntity.fromDomain(domain);
    const saved = await this.highDemandRepository.saveHighDemandRegistration(entity)
    // Registramos en su historial
    const newHistory = {
      highDemandRegistrationId: saved.id,
      workflowStateId: saved.workflowStateId,
      registrationStatus: saved.registrationStatus,
      userId: saved.userId,
      observation: ''
    }
    console.log("pasa de esto")
    this.historyRepository.updatedHistory(newHistory)
    console.log("no pasa de esto")
    return saved
  }

  async modifyWorkflowStatus(highDemandId: number): Promise<HighDemandRegistration> {
    const updatedHighDemand = await this.highDemandRepository.updateWorkflowStatus(highDemandId)
    return updatedHighDemand
  }

  async getHighDemandRegistration(educationalInstitutionId: number): Promise<HighDemandRegistration> {
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