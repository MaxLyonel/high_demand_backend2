// framework nestjs
import { Injectable } from "@nestjs/common";
// own implementations
import { EducationalInstitutionCourseService } from "../../domain/ports/inbound/educational-institution-course.service";
import { EducationalInstitutionCourseRepository } from '../../domain/ports/outbound/educational-institution-course.repository';
import { GroupedEducationalInstitutionCourses } from "../dtos/educational-institution-course-response.dto";



@Injectable()
export class EducationalInstitutionCourseImpl implements EducationalInstitutionCourseService {
  constructor(
    private readonly educationalInstitutionCourseRepository: EducationalInstitutionCourseRepository
  ) {}

  // async courseList(sie: number): Promise<EducationalInstitutionCourse[]> {
  async courseList(sie: number, gestionTypeId: number): Promise<GroupedEducationalInstitutionCourses> {
    const courses = await this.educationalInstitutionCourseRepository.findBySie(sie, gestionTypeId)
    return courses
  }

}