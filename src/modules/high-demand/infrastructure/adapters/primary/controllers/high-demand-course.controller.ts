import { HighDemanCourseDto } from "@high-demand/application/dtos/high-demand-request.dto";
import { HighDemandCourseService } from "@high-demand/domain/ports/inbound/high-demand-course.service";
import { Body, Controller, Post } from "@nestjs/common";




@Controller('high-demand-course')
export class HighDemandCourseController {
  constructor(
    private readonly highDemandCourseService: HighDemandCourseService
  ) {}

  @Post('create-high-demand-course')
  createHighDemanCourse(@Body() body: HighDemanCourseDto){
    return this.highDemandCourseService.saveHighDemandCourseRegistration(body)
  }
}