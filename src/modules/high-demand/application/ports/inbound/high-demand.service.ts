import { EducationalInstitutionCourse } from "src/modules/high-demand/domain/models/educational-institution-course.model";
import { EducationalInstitution } from "src/modules/high-demand/domain/models/educational-institution.model";
import { HighDemandRegistration } from "src/modules/high-demand/domain/models/high-demand-registration.model";



export abstract class HighDemandService {

  abstract saveHighDemandRegistration(obj: HighDemandRegistration): Promise<HighDemandRegistration>;
  abstract cancelHighDemands(): Promise<boolean>;
  abstract listHighDemands(): Promise<EducationalInstitution[]>;
  abstract modifyHighDemand(): Promise<HighDemandRegistration>;
  abstract changeHighDemandStatus(): Promise<any>;

}
