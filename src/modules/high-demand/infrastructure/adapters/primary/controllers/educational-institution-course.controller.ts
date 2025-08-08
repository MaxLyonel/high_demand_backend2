// framework nestjs
import { Controller, Get, Query } from "@nestjs/common";
// own implementations
import { EducationalInstitutionCourseService } from "@high-demand/domain/ports/inbound/educational-institution-course.service"

@Controller('educational-institution-course')
export class EducationalInstitutionCourseController {
  constructor(
    private readonly educationalInstitutionCourseService: EducationalInstitutionCourseService
  ) {}

  @Get('course-structure')
  getCourseList(@Query() query) {
    const { sie, gestionTypeId } = query
    return this.educationalInstitutionCourseService.courseList(sie, gestionTypeId)
  }
}