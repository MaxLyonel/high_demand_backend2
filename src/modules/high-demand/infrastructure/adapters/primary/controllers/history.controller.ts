import { JwtAuthGuard } from "@access-control/infrastructure/adapters/primary/guards/jwt-auth.guard";
import { LocalAuthGuard } from "@access-control/infrastructure/adapters/primary/guards/local-auth.guard";
import { HistoryService } from "@high-demand/domain/ports/inbound/history.service";
import { DepartmentReportService } from "@high-demand/domain/ports/outbound/department-report.service";
import { DistrictReportService } from "@high-demand/domain/ports/outbound/district-report.service";
import { Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Req, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";


@Controller('history')
export class HistoryController {

  constructor(
    private readonly historyService: HistoryService,
    private readonly districtReportService: DistrictReportService,
    private readonly departmentReportService: DepartmentReportService
  ) {}

  @Get('list/:highDemandRegistrationId')
  async getList(@Param('highDemandRegistrationId') highDemandRegistrationId: number) {
    try {
      const result = await this.historyService.historyList(highDemandRegistrationId)
      return {
        status: 'success',
        message: 'Proceso exitoso',
        data: result
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al obtener el historial',
      }, HttpStatus.BAD_REQUEST)
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('list-histories')
  async getHistories(@Req() req) {
    try {
      const result = await this.historyService.historiesList(req.user)
      return {
        status: 'success',
        message: 'Listado de historiales obtenido exitosamente',
        data: result
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al obtener el listado de historiales'
      }, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('list-high-demands-by-district/:districtId')
  async getHighDemandsByDistrict(
    @Param('districtId', ParseIntPipe) districtId: number,
    @Res() res: Response
  ) {
    try {
      const result = await this.historyService.getHighDemandsByDistrict(districtId)
      await this.districtReportService.generateDistrictReport(result, res)
    } catch (error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al obtener el listado de altas demandas'
      }, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('list-high-demands-by-department/:departmentId')
  async getHighDemandsByDepartment(
    @Param('departmentId', ParseIntPipe) departmentId: number,
    @Res() res: Response
  ) {
    try {
      const result = await this.historyService.getHighDemandsByDepartment(departmentId)
      console.log(result)
      await this.departmentReportService.generateDepartmentReport(result, res)
      return result
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al obtener el listado de altas demandas'
      }, HttpStatus.BAD_REQUEST)
    }
  }

}