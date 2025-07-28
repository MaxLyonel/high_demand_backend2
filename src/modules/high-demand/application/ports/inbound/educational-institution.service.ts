import { EducationalInstitution } from '../../../domain/models/educational-institution.model';



export abstract class EducationalInstitutionService {
  abstract getInfoEducationalInstitution(sie: number): Promise<EducationalInstitution | null>;
}