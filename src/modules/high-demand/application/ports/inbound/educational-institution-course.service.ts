import { EducationalInstitutionCourse } from "src/modules/high-demand/domain/models/educational-institution-course.model";
import { EducationalInstitutionCourseResponse } from "../../dtos/educational-institution-course-response.dto";




export abstract class EducationalInstitutionCourseService {
  abstract courseList(sie: number, gestionTypeId: number): Promise<EducationalInstitutionCourseResponse[]>;
}