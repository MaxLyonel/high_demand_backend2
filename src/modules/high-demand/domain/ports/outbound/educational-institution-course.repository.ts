import { GroupedEducationalInstitutionCourses } from "@high-demand/application/dtos/educational-institution-course-response.dto";


export abstract class EducationalInstitutionCourseRepository {
  // abstract findBySie(id: number, gestionTypeId: number): Promise<EducationalInstitutionCourseResponse[]>;
  abstract findBySie(id: number, gestionTypeId: number): Promise<GroupedEducationalInstitutionCourses>;
}