import { HighDemandRegistration } from "@high-demand/domain/models/high-demand-registration.model"


export abstract class HighDemandRepository {
  abstract findById(id: number): Promise<HighDemandRegistration | null>;
  abstract saveHighDemandRegistration(obj: any): Promise<HighDemandRegistration>;
  abstract modifyHighDemanRegistration(obj: any): Promise<HighDemandRegistration>;
  abstract updateStatusHighDeman(id: number, newStatus: any): Promise<HighDemandRegistration>;
  abstract onATray(id: number): Promise<boolean>;
  abstract udpateFlowStatus(id: number, nextFlowStatus: number): Promise<HighDemandRegistration>;
  abstract findInscriptions(obj: HighDemandRegistration): Promise<HighDemandRegistration[]>;
}