// framework nestjs
import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Query } from "@nestjs/common";
// own implementations
import { HighDemandService } from "@high-demand/domain/ports/inbound/high-demand.service"
import { CreateHistoryDto } from "@high-demand/application/dtos/create-history.dto";
import { CreateHighDemandDto } from "@high-demand/application/dtos/create-high-demand.dto";
import { RegisterHighDemandDto } from "@high-demand/application/dtos/register-high-demand.dto";


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
        message: 'Se guardaron los datos exitosamente',
        data: result
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al guardar la institución como Alta Demanda',
      }, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('send-high-demand')
  async sendHighDemand(@Body() body: RegisterHighDemandDto){
    try {
      const result = await this.highDemandService.sendHighDemand(body)
      return {
         status: 'success',
         message: 'Registro de Alta Demanda exitoso',
         data: result
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al registrar la institución como Alta Demanda'
      }, HttpStatus.BAD_REQUEST)
    }
  }

  @Get(':id/receive')
  async receiveHighDemand(@Param('id', ParseIntPipe) id: number ) {
    try {
      const result = await this.highDemandService.receiveHighDemand(id)
      return {
        status: 'success',
        message: 'Se recepcionó exitosamente',
        data: result
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al recepcionar'
      }, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('list-receive')
  async listReceiveHighDemands(@Query() params: any) {
    try {
      const { rolId, stateId } = params
      const result = await this.highDemandService.listReceived(rolId, stateId)
      return {
        status: 'success',
        message: 'Listado de recepcionados obtenido exitosamente',
        data: result
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al obtener la lista de recepcionados'
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

  @Get('list-by-state-rol')
  async getHighDemandsRolState(@Query() params: any) {
    try {
      const { rolId, stateId } = params
      const result = await this.highDemandService.listInbox(rolId, stateId)
      return {
        status: 'succes',
        message: 'Listado de Altas demandas exitoso',
        data: result
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al obtener altas demandas por estado y rol',
      }, HttpStatus.BAD_REQUEST)
    }
  }
}