import { EducationalInstitutionCourseResponse, GroupedEducationalInstitutionCourses } from "@high-demand/application/dtos/educational-institution-course-response.dto";


export abstract class EducationalInstitutionCourseService {
  abstract courseList(sie: number, gestionTypeId: number): Promise<GroupedEducationalInstitutionCourses>;
}