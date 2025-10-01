import { RegistrationStatus } from "@high-demand/domain/enums/registration-status.enum";
import { HighDemandRegistration } from "@high-demand/domain/models/high-demand-registration.model";

export abstract class MainInboxRepository {
  abstract receiveHighDemands(highDemandIds: number[]): Promise<HighDemandRegistration[]>;
  abstract deriveHighDemands(highDemandIds: number[], rolId: number): Promise<HighDemandRegistration[]>;
  abstract approveHighDemand(id: number, registrationStatus: RegistrationStatus): Promise<HighDemandRegistration>;
  abstract declinehighDemand(id: number, registrationStatus: RegistrationStatus): Promise<HighDemandRegistration>;
  abstract searchInbox(rolId: number, stateId: number, placeTypeId: number[]): Promise<HighDemandRegistration[]>;
  abstract searchReceived(rolId: number, placeTypes: number[]): Promise<HighDemandRegistration[]>;
  abstract searchChildren(parentId: number): Promise<any>;
}