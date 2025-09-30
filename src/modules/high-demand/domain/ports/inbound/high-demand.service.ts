import { CreateHistoryDto } from "@high-demand/application/dtos/create-history.dto"
import { HighDemandRegistration } from "@high-demand/domain/models/high-demand-registration.model"

export abstract class HighDemandService {

  abstract saveHighDemandRegistration(
    obj: Omit<HighDemandRegistration, 'id' | 'courses' | 'workflowStateId' | 'registrationStatus' | 'operativeId' | 'inbox' | 'workflowId' | 'placeDistrict'>,
    course: any
  ): Promise<HighDemandRegistration>;
  abstract sendHighDemand(obj: any): Promise<HighDemandRegistration>;
  abstract listHighDemandsApproved(): Promise<any[]>
  abstract getHighDemandRegistration(educationalInstitutionId: number): Promise<HighDemandRegistration | null>;
  abstract modifyWorkflowStatus(obj: CreateHistoryDto): Promise<HighDemandRegistration>;
  abstract cancelHighDemand(obj: any): Promise<any>;
}
