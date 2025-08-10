import { HighDemandCourseDto } from "@high-demand/application/dtos/high-demand-course-request.dto";
import { HighDemandCourseService } from "@high-demand/domain/ports/inbound/high-demand-course.service";
import { Body, Controller, HttpException, HttpStatus, Post } from "@nestjs/common";




@Controller('high-demand-course')
export class HighDemandCourseController {
  constructor(
    private readonly highDemandCourseService: HighDemandCourseService
  ) {}

  @Post('create-high-demand-course')
  async createHighDemanCourse(@Body() dto: HighDemandCourseDto){
    try {
      const result = await this.highDemandCourseService.saveHighDemandCourseRegistration(dto)
      return {
        status: 'success',
        message: 'Registro exitoso',
        data: result,
      }
    } catch(error) {
      throw new HttpException({
      status: 'error',
      message: error.message || 'Error al registrar curso',
    }, HttpStatus.BAD_REQUEST);
    }
  }
}