// framework nestjs
import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from "@nestjs/common";
// own implementations
import { HighDemandService } from "@high-demand/domain/ports/inbound/high-demand.service"
import { CreateHistoryDto } from "@high-demand/application/dtos/create-history.dto";
import { CreateHighDemandDto } from "@high-demand/application/dtos/create-high-demand.dto";


@Controller('high-demand')
export class HighDemandController {
  constructor(
    private readonly highDemandService: HighDemandService
  ) {}

  @Post('create-high-demand')
  async createHighDemandRegistration(@Body() body: CreateHighDemandDto) {
    try {
      const { highDemand, courses } = body
      const result = await this.highDemandService.saveHighDemandRegistration(highDemand, courses)
      return {
        status: 'success',
        message: 'Registro exitoso de la Unidad Educativa como Alta Demanda',
        data: result
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al registrar la institución como Alta Demanda',
      }, HttpStatus.BAD_REQUEST)
    }
  }

  @Get(':id/by-institution')
  getHighDemandByInstitution(@Param('id') id: number) {
    return this.highDemandService.getHighDemandRegistration(id)
  }

  @Post('udpate-state-worfkflow')
  updateStateWorkflow(@Body() body: CreateHistoryDto) {
    return this.highDemandService.modifyWorkflowStatus(body)
  }
}