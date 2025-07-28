import { EducationalInstitutionCourse } from "src/modules/high-demand/domain/models/educational-institution-course.model";
import { EducationalInstitution } from "src/modules/high-demand/domain/models/educational-institution.model";



export abstract class HighDemandService {

  abstract saveHighDemandRegistration(sie: number): Promise<any>;
  abstract cancelHighDemands(): Promise<any>;
  abstract listHighDemands(): Promise<EducationalInstitution[]>;
  abstract modifyHighDemand(): Promise<any>;
  abstract changeHighDemandStatus(): Promise<any>;
}
