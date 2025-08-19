import { EducationalInstitutionDto } from "@high-demand/application/dtos/educational-institution-info-response.dto";
import { EducationalInstitution } from "@high-demand/domain/models/educational-institution.model"

export abstract class EducationalInstitutionRepository {
  abstract findBySie(id: number): Promise<EducationalInstitutionDto | null>;
  abstract searchEducationalInstitutionDistrict(id: number): Promise<any>;
}