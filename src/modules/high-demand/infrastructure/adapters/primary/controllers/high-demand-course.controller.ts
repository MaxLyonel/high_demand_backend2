import { HighDemandCourseDto } from "@high-demand/application/dtos/high-demand-course-request.dto";
import { HighDemandCourseService } from "@high-demand/domain/ports/inbound/high-demand-course.service";
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";




@Controller('high-demand-course')
export class HighDemandCourseController {
  constructor(
    private readonly highDemandCourseService: HighDemandCourseService
  ) {}

  @Post('create')
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

  @Patch(':id/quota')
  async modifyQuota(
    @Param('id', ParseIntPipe) id: number,
    @Body('totalQuota', ParseIntPipe) totalQuota: number
  ) {
    try {
      const result = await this.highDemandCourseService.changeHighDemandCourseQuota(id, totalQuota)
      return {
        status: 'success',
        message: 'Actualizacion exitosa',
        data: result
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al actualizar el cupo',
      }, HttpStatus.BAD_REQUEST)
    }
  }

  @Delete('delete/:id')
  async deleteCourse(@Param('id') id: number) {
    return this.highDemandCourseService.deleteCourse(id);
  }

  @Get('courses/:highDemandId')
  getCourses(@Param('highDemandId') highDemandId: number) {
    return this.highDemandCourseService.getCourse(highDemandId)
  }

}