import { HistoryService } from "@high-demand/domain/ports/inbound/history.service";
import { DistrictReportService } from "@high-demand/domain/ports/outbound/district-report.service";
import { Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Res } from "@nestjs/common";
import { Response } from "express";


@Controller('history')
export class HistoryController {

  constructor(
    private readonly historyService: HistoryService,
    private readonly districtReportService: DistrictReportService
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

  @Get('list-histories')
  async getHistories() {
    try {
      const result = await this.historyService.historiesList()
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

}