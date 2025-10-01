import { HighDemandRegistration } from "@high-demand/domain/models/high-demand-registration.model";




export abstract class MainInboxService {
  abstract receiveHighDemands(highDemandIds: number[], userId: number): Promise<HighDemandRegistration[]>;
  abstract deriveHighDemands(highDemandIds: number[], rolId: number, observation?: string | null): Promise<HighDemandRegistration[]>;
  abstract approveHighDemand(obj: any): Promise<any>;
  abstract declineHighDemand(obj:any): Promise<any>;
  abstract getRolesToGo(rolId: number): Promise<any>;
  // listar por distrito
  abstract listInbox(rolId: number, stateId: number, placeTypeId: number): Promise<any[]>;
  abstract listReceived(rolId: number, placeTypeId: number): Promise<any[]>;
}