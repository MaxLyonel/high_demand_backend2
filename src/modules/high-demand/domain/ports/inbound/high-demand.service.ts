import { CreateHistoryDto } from "@high-demand/application/dtos/create-history.dto"
import { HighDemandRegistration } from "@high-demand/domain/models/high-demand-registration.model"

export abstract class HighDemandService {

  abstract saveHighDemandRegistration(
    obj: Omit<HighDemandRegistration, 'id' | 'courses' | 'workflowStateId' | 'registrationStatus' | 'operativeId' | 'inbox' | 'workflowId'>,
    course: any
  ): Promise<HighDemandRegistration>;
  abstract sendHighDemand(obj: any): Promise<HighDemandRegistration>;
  abstract listInbox(rolId: number, stateId: number): Promise<any[]>;
  abstract listReceived(rolId: number, stateId: number): Promise<any[]>;
  abstract receiveHighDemand(id: number): Promise<any>;

  abstract getHighDemandRegistration(educationalInstitutionId: number): Promise<HighDemandRegistration | null>;
  abstract modifyWorkflowStatus(obj: CreateHistoryDto): Promise<HighDemandRegistration>;

}
