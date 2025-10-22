import { RolRepository } from "@access-control/domain/ports/outbound/rol.repository";
import { UserRepository } from "@access-control/domain/ports/outbound/user.repository";
import { RegistrationStatus } from "@high-demand/domain/enums/registration-status.enum";
import { HighDemandRegistration } from "@high-demand/domain/models/high-demand-registration.model";
import { MainInboxService } from "@high-demand/domain/ports/inbound/main-inbox.service";
import { EducationalInstitutionRepository } from "@high-demand/domain/ports/outbound/educational-institution.repository";
import { HistoryRepository } from "@high-demand/domain/ports/outbound/history.repository";
import { MainInboxRepository } from "@high-demand/domain/ports/outbound/main-inbox.repository";
import { WorkflowSequenceRepository } from "@high-demand/domain/ports/outbound/workflow-sequence.repository";
import { WorkflowStateRepository } from "@high-demand/domain/ports/outbound/workflow-state.repository";
import { Inject, Injectable } from "@nestjs/common";




@Injectable()
export class MainInboxImpl implements MainInboxService {
  constructor(
    @Inject('APP_CONSTANTS') private readonly constants,
    private readonly mainInboxRepository: MainInboxRepository,
    private readonly historyRepository: HistoryRepository,
    private readonly workflowSequenceRepository: WorkflowSequenceRepository,
    private readonly workflowStateRepository: WorkflowStateRepository,
    private readonly rolRepository: RolRepository,
    private readonly userRepository: UserRepository,
    private readonly educationalInstitutionRepository: EducationalInstitutionRepository,
  ){}

  // ****** Recibir la Alta Demanda *****
  async receiveHighDemands(highDemandIds: number[], userId: number): Promise<HighDemandRegistration[]> {
    const highDemands = await this.mainInboxRepository.receiveHighDemands(highDemandIds)
    for(let highDemand of highDemands) {
      const newHistory = {
        highDemandRegistrationId: highDemand.id,
        workflowStateId: highDemand.workflowStateId,
        registrationStatus: highDemand.registrationStatus,
        userId: userId,
        rolId: highDemand.rolId,
        observation: ''
      }
      this.historyRepository.updatedHistory(newHistory)
    }
    return highDemands
  }

  // ** Derivar alta demanda **
  async deriveHighDemands(highDemandIds: number[], rolId: number, observation: string | null): Promise<HighDemandRegistration[]> {
    const highDemands = await this.mainInboxRepository.deriveHighDemands(highDemandIds, rolId)
    for(let highDemand of highDemands){
      const newHistory = {
        highDemandRegistrationId: highDemand.id,
        workflowStateId: highDemand.workflowStateId,
        registrationStatus: highDemand.registrationStatus,
        userId: highDemand.userId,
        rolId: highDemand.rolId,
        observation: observation
      }
      this.historyRepository.updatedHistory(newHistory)
    }
    return highDemands
  }

  // ** Devolver alta demanda **
  async returnHighDemand(highDemandId: number, rolId: number, observation: string | null): Promise<HighDemandRegistration> {
    const highDemand = await this.mainInboxRepository.returnHighDemands(highDemandId, rolId)
    const newHistory = {
      highDemandRegistrationId: highDemand.id,
      workflowStateId: highDemand.workflowStateId,
      registrationStatus: highDemand.registrationStatus,
      userId: highDemand.userId,
      rolId: highDemand.rolId,
      observation: observation
    }
    this.historyRepository.updatedHistory(newHistory)
    return highDemand
  }

  // ** rechazar alta demanda **
  async declineHighDemand(highDemandId: number, observation: string | null): Promise<any> {
    const saved = await this.mainInboxRepository.declinehighDemand(highDemandId)
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
    const saved = await this.mainInboxRepository.approveHighDemand(obj.id, RegistrationStatus.APPROVED)
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

  // ****** Listar Altas Demandas de la Bandeja de Entrada ******
  async listInbox(rolId: number, placeTypeId: number): Promise<any[]> {
    const { ROLES } = this.constants
    const { DISTRICT_ROLE, DEPARTMENT_ROLE } = ROLES
    let placeTypes:Array<number> = []
    switch(parseInt(rolId.toString())) {
      case DISTRICT_ROLE:
        placeTypes.push(placeTypeId)
        break;
      case DEPARTMENT_ROLE:
        // const places = await this.mainInboxRepository.searchChildren(placeTypeId)
        // placeTypes = places.map(p => p.id)
        placeTypes = [placeTypeId]
        break;
    }
    const highDemands = await this.mainInboxRepository.searchInbox(rolId, placeTypes)
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
    const { ROLES } = this.constants
    const { DISTRICT_ROLE, DEPARTMENT_ROLE } = ROLES
    let placeTypes:Array<number> = []
    switch(parseInt(rolId.toString())) {
      case DISTRICT_ROLE:
        placeTypes.push(placeTypeId)
        break;
      case DEPARTMENT_ROLE:
        const places = await this.mainInboxRepository.searchChildren(placeTypeId)
        placeTypes = places.map(p => p.id)
        break;
    }
    const highDemands = await this.mainInboxRepository.searchReceived(rolId, placeTypes)
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

  // ** Obtener los roles a donde ir **
  async getRolesToGo(rolId: number): Promise<any> {
    const workflowSequences = await this.workflowSequenceRepository.findNextStates(rolId)
    return workflowSequences
  }
}