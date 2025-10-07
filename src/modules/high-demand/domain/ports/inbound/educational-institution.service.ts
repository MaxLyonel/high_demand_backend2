import { EducationalInstitutionDto } from '@high-demand/application/dtos/educational-institution-info-response.dto';


export abstract class EducationalInstitutionService {
  abstract getInfoEducationalInstitution(sie: number): Promise<EducationalInstitutionDto | null>;
  abstract searchEducationalInstitutionDistrict(sie: number): Promise<any>;
}