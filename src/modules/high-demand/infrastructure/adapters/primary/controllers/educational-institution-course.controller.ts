import { Controller, Get, Query } from "@nestjs/common";
import { EducationalInstitutionCourseService } from "src/modules/high-demand/application/ports/inbound/educational-institution-course.service";

@Controller('educational-institution-course')
export class EducationalInstitutionCourseController {
  constructor(
    private readonly educationalInstitutionCourseService: EducationalInstitutionCourseService
  ) {}

  @Get('all-courses')
  getCourseList(@Query() query) {
    const { sie, gestionTypeId } = query
    return this.educationalInstitutionCourseService.courseList(sie, gestionTypeId)
  }
}