import { EducationalInstitution } from "@high-demand/domain/models/educational-institution.model"
import { HighDemandRegistration } from "@high-demand/domain/models/high-demand-registration.model"

export abstract class HighDemandService {

  abstract saveHighDemandRegistration(obj: Omit<HighDemandRegistration, 'id' | 'courses' | 'workflowStateId' | 'registrationStatus' | 'operativeId' | 'inbox' | 'workflowId'>): Promise<HighDemandRegistration>;
  abstract cancelHighDemands(): Promise<boolean>;
  abstract listHighDemands(): Promise<EducationalInstitution[]>;
  abstract modifyHighDemand(): Promise<HighDemandRegistration>;
  abstract changeHighDemandStatus(): Promise<any>;

}
