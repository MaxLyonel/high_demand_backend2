import { HistoryService } from "@high-demand/domain/ports/inbound/history.service";
import { Controller, Get, HttpException, HttpStatus, Param } from "@nestjs/common";


@Controller('history')
export class HistoryController {

  constructor(
    private readonly historyService: HistoryService
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

}