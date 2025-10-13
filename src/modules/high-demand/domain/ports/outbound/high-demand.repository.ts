import { CreateHistoryDto } from "@high-demand/application/dtos/create-history.dto";
import { RegistrationStatus } from "@high-demand/domain/enums/registration-status.enum";
import { HighDemandRegistration } from "@high-demand/domain/models/high-demand-registration.model"


export abstract class HighDemandRepository {
  abstract saveHighDemandRegistration(obj: any): Promise<HighDemandRegistration>;
  abstract cancelHighDemand(obj: any, registrationStatus: RegistrationStatus): Promise<any>;
  abstract getHighDemandsApproved(departmentId: number): Promise<any[]>;
  abstract getHighDemandRegistered(highDemandId: number): Promise<any>;


  abstract findById(id: number): Promise<HighDemandRegistration | null>;
  abstract findInscriptions(obj: HighDemandRegistration): Promise<HighDemandRegistration[]>;
  abstract findByInstitutionId(educationalInstitutionId: number): Promise<HighDemandRegistration | null>;
  abstract updateWorkflowStatus(obj: CreateHistoryDto): Promise<HighDemandRegistration>;

  abstract searchFather(placeTypeId: number): Promise<any>;
  abstract searchChildren(placeTypeId: number): Promise<any>;

}