import { EducationalInstitutionDto } from '@high-demand/application/dtos/educational-institution-info-response.dto';
import { EducationalInstitution } from '@high-demand/domain/models/educational-institution.model';


export abstract class EducationalInstitutionService {
  abstract getInfoEducationalInstitution(sie: number): Promise<EducationalInstitutionDto | null>;
}