import { EducationalInstitution } from "src/modules/high-demand/domain/models/educational-institution.model";


export abstract class EducationalInstitutionRepository {
  abstract findBySie(id: number): Promise<EducationalInstitution | null>;
}