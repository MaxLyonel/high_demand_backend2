import { EducationalInstitution } from "../models/educational-institution.model";


export abstract class EducationalInstitutionRepository {
  abstract findBySie(id: number): Promise<EducationalInstitution | null>;
  abstract findByDirector(personId: number): Promise<EducationalInstitution | null>;
}