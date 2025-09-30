



export abstract class MainInboxService {
  abstract receiveHighDemands(highDemandIds: number[], userId: number): Promise<any>;
  abstract deriveHighDemands(highDemandIds: number[], rolId: number, observation?: string | null): Promise<any>;
  abstract approveHighDemand(obj: any): Promise<any>;
  abstract declineHighDemand(obj:any): Promise<any>;
  abstract getRolesToGo(rolId: number): Promise<any>;
  // listar por distrito
  abstract listInbox(rolId: number, stateId: number, placeTypeId: number): Promise<any[]>;
  abstract listReceived(rolId: number, placeTypeId: number): Promise<any[]>;
}