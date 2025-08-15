import { CreateHistoryDto } from "@high-demand/application/dtos/create-history.dto";
import { HighDemandRegistration } from "@high-demand/domain/models/high-demand-registration.model"


export abstract class HighDemandRepository {
  abstract findById(id: number): Promise<HighDemandRegistration | null>;
  abstract saveHighDemandRegistration(obj: any): Promise<HighDemandRegistration>;
  abstract updatedInbox(id: number): Promise<HighDemandRegistration>;
  abstract searchByInbox(rolId: number, stateId: number): Promise<HighDemandRegistration[]>;
  abstract searchByReceived(rolId: number, stateId: number): Promise<any>;


  abstract findInscriptions(obj: HighDemandRegistration): Promise<HighDemandRegistration[]>;
  abstract findByInstitutionId(educationalInstitutionId: number): Promise<HighDemandRegistration | null>;
  abstract updateWorkflowStatus(obj: CreateHistoryDto): Promise<HighDemandRegistration>;
}