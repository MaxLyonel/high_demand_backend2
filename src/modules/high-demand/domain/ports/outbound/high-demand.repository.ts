import { CreateHistoryDto } from "@high-demand/application/dtos/create-history.dto";
import { RegistrationStatus } from "@high-demand/domain/enums/registration-status.enum";
import { HighDemandRegistration } from "@high-demand/domain/models/high-demand-registration.model"


export abstract class HighDemandRepository {
  abstract saveHighDemandRegistration(obj: any): Promise<HighDemandRegistration>;
  abstract receiveHighDemands(highDemandIds: number[], nextStateId: number): Promise<HighDemandRegistration>;
  abstract deriveHighDemands(highDemandIds: number[], rolId: number): Promise<any>;
  abstract approveHighDemand(id: number, registrationStatus: RegistrationStatus): Promise<HighDemandRegistration>;
  abstract declinehighDemand(id: number, registrationStatus: RegistrationStatus): Promise<HighDemandRegistration>;
  // distrito
  abstract searchInbox(rolId: number, stateId: number, placeTypeId: number[]): Promise<HighDemandRegistration[]>;
  abstract searchReceived(rolId: number, placeTypes: number[]): Promise<HighDemandRegistration[]>;

  abstract getHighDemandsApproved(): Promise<any[]>;
  abstract cancelHighDemand(obj: any, registrationStatus: RegistrationStatus): Promise<any>;


  abstract findById(id: number): Promise<HighDemandRegistration | null>;
  abstract findInscriptions(obj: HighDemandRegistration): Promise<HighDemandRegistration[]>;
  abstract findByInstitutionId(educationalInstitutionId: number): Promise<HighDemandRegistration | null>;
  abstract updateWorkflowStatus(obj: CreateHistoryDto): Promise<HighDemandRegistration>;

  abstract searchFather(placeTypeId: number): Promise<any>;
  abstract searchChildren(parentId: number): Promise<any>;
}