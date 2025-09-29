import { CreateHistoryDto } from "@high-demand/application/dtos/create-history.dto"
import { HighDemandRegistration } from "@high-demand/domain/models/high-demand-registration.model"

export abstract class HighDemandService {

  abstract saveHighDemandRegistration(
    obj: Omit<HighDemandRegistration, 'id' | 'courses' | 'workflowStateId' | 'registrationStatus' | 'operativeId' | 'inbox' | 'workflowId' | 'placeDistrict'>,
    course: any
  ): Promise<HighDemandRegistration>;
  abstract sendHighDemand(obj: any): Promise<HighDemandRegistration>;
  abstract receiveHighDemands(highDemandIds: number[], userId: number): Promise<any>;
  abstract deriveHighDemands(highDemandIds: number[], rolId: number, observation?: string | null): Promise<any>;
  abstract approveHighDemand(obj: any): Promise<any>;
  abstract declineHighDemand(obj:any): Promise<any>;
  abstract getRolesToGo(rolId): Promise<any>;
  abstract cancelHighDemand(obj: any): Promise<any>;
  // listar por distrito
  abstract listInbox(rolId: number, stateId: number, placeTypeId: number): Promise<any[]>;
  abstract listReceived(rolId: number, placeTypeId: number): Promise<any[]>;

  // altas demandas para la pre-inscripción
  abstract listHighDemandsApproved(): Promise<any[]>

  abstract getHighDemandRegistration(educationalInstitutionId: number): Promise<HighDemandRegistration | null>;
  abstract modifyWorkflowStatus(obj: CreateHistoryDto): Promise<HighDemandRegistration>;
}
