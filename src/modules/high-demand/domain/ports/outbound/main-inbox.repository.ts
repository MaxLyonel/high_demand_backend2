import { RegistrationStatus } from "@high-demand/domain/enums/registration-status.enum";
import { HighDemandRegistration } from "@high-demand/domain/models/high-demand-registration.model";

export abstract class MainInboxRepository {
  // ** recibir altas demandas en la bandeja **
  abstract receiveHighDemands(highDemandIds: number[]): Promise<HighDemandRegistration[]>;
  // ** derivar altas demandas **
  abstract deriveHighDemands(highDemandIds: number[], rolId: number): Promise<HighDemandRegistration[]>;
  // ** devolver una alta demanda **
  abstract returnHighDemands(highDemandId: number, rolId: number): Promise<HighDemandRegistration>;

  // ** aprobar una alta demanda **
  abstract approveHighDemand(id: number, registrationStatus: RegistrationStatus): Promise<HighDemandRegistration>;
  // ** rechazar una alta demanda **
  abstract declinehighDemand(highDemandId: number): Promise<HighDemandRegistration>;

  abstract searchInbox(rolId: number, placeTypeId: number[]): Promise<HighDemandRegistration[]>;
  abstract searchReceived(rolId: number, placeTypes: number[]): Promise<HighDemandRegistration[]>;
  abstract searchChildren(parentId: number): Promise<any>;
}