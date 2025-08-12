import { CreateHistoryDto } from "@high-demand/application/dtos/create-history.dto";
import { HighDemandRegistration } from "@high-demand/domain/models/high-demand-registration.model"


export abstract class HighDemandRepository {
  abstract findById(id: number): Promise<HighDemandRegistration | null>;
  abstract saveHighDemandRegistration(obj: any): Promise<HighDemandRegistration>;
  abstract modifyHighDemanRegistration(obj: any): Promise<HighDemandRegistration>;
  abstract updateStatusHighDeman(id: number, newStatus: any): Promise<HighDemandRegistration>;
  abstract onATray(id: number): Promise<boolean>;
  abstract udpateFlowStatus(id: number, nextFlowStatus: number): Promise<HighDemandRegistration>;
  abstract findInscriptions(obj: HighDemandRegistration): Promise<HighDemandRegistration[]>;
  abstract findByInstitutionId(educationalInstitutionId: number): Promise<HighDemandRegistration | null>;
  abstract updateWorkflowStatus(obj: CreateHistoryDto): Promise<HighDemandRegistration>;
}