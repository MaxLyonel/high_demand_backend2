import { HighDemandRegistration } from "src/modules/high-demand/domain/models/high-demand-registration.model";






export abstract class HighDemandRepository {
  abstract findById(id: number): Promise<HighDemandRegistration>;
  abstract saveHighDemandRegistration(obj: any): Promise<boolean>;
  abstract modifyHighDemanRegistration(obj: any): Promise<HighDemandRegistration>;
  abstract updateStatusHighDeman(id: number, newStatus: any): Promise<HighDemandRegistration>;
  abstract onATray(id: number): Promise<boolean>;
  abstract udpateFlowStatus(id: number, nextFlowStatus: number): Promise<HighDemandRegistration>;
}