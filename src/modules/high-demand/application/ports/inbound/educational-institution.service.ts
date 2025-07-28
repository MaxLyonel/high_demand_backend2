import { EducationalInstitutionCourse } from 'src/modules/high-demand/domain/models/educational-institution-course.model';
import { EducationalInstitution } from '../../../domain/models/educational-institution.model';



export abstract class EducationalInstitutionService {
  abstract getInfoEducationalInstitution(sie: number): Promise<EducationalInstitution | null>;
  abstract getEducationalInstitutionCourse(sie: number): Promise<EducationalInstitutionCourse | null>;
}