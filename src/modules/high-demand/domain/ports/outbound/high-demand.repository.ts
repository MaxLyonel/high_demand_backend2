import { CreateHistoryDto } from "@high-demand/application/dtos/create-history.dto";
import { HighDemandRegistration } from "@high-demand/domain/models/high-demand-registration.model"


export abstract class HighDemandRepository {
  abstract saveHighDemandRegistration(obj: any): Promise<HighDemandRegistration>;
  abstract updatedInbox(id: number, nextStateId: number): Promise<HighDemandRegistration>;
  abstract deriveHighDemand(id: number, rolId: number): Promise<any>;
  abstract searchByInbox(rolId: number, stateId: number): Promise<HighDemandRegistration[]>;
  abstract searchByReceived(rolId: number): Promise<any>;


  abstract findById(id: number): Promise<HighDemandRegistration | null>;
  abstract findInscriptions(obj: HighDemandRegistration): Promise<HighDemandRegistration[]>;
  abstract findByInstitutionId(educationalInstitutionId: number): Promise<HighDemandRegistration | null>;
  abstract updateWorkflowStatus(obj: CreateHistoryDto): Promise<HighDemandRegistration>;
}