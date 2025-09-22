// framework nestjs
import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Query, UseGuards } from "@nestjs/common";
// own implementations
import { HighDemandService } from "@high-demand/domain/ports/inbound/high-demand.service"
import { CreateHistoryDto } from "@high-demand/application/dtos/create-history.dto";
import { CreateHighDemandDto } from "@high-demand/application/dtos/create-high-demand.dto";
import { RegisterHighDemandDto } from "@high-demand/application/dtos/register-high-demand.dto";
import { JwtAuthGuard } from "@access-control/infrastructure/adapters/primary/guards/jwt-auth.guard";
import { User } from "../decorators/user.decorator";


@Controller('high-demand')
export class HighDemandController {
  constructor(
    private readonly highDemandService: HighDemandService
  ) {}

  @Post('create')
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

  @Post('send')
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

  @Post('derive')
  async deriveHighDemand(@Body() body: any) {
    try {
      const { highDemand, rolId, observation } = body
      const result = await this.highDemandService.deriveHighDemand(highDemand, rolId, observation)
      return {
        status: 'success',
        message: 'Derivacion exitosa',
        data: result
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al derivar la alta demanda'
      }, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('approve')
  async approveHighDemand(@Body() body: any) {
    try {
      const { highDemand } = body
      const result = await this.highDemandService.approveHighDemand(highDemand)
      return {
        status: 'success',
        message: 'Registro como Alta Demanda exitosa',
        data: result
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al aprobar la alta demanda'
      }, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('decline')
  async declineHighDemand(@Body() body: any) {
    try {
      const { highDemand } = body
      const result = await this.highDemandService.declineHighDemand(highDemand)
      return {
        status: 'success',
        message: 'Alta demanda rechazada',
        data: result
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al rechazar la alta demanda'
      }, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('list-inbox')
  async getHighDemandsRolState(@Query() params: any) {
    try {
      const { rolId, stateId, placeTypeId } = params
      const result = await this.highDemandService.listInbox(rolId, stateId, placeTypeId)
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

  @Get('list-inbox-department')
  async listDepartmentInbox(@Query() params: any) {
    try {
      const { rolId, stateId, placeTypeId } = params
      const result = await this.highDemandService.listInboxDepartment(rolId, stateId, placeTypeId)
      return {
        status: 'success',
        message: 'Listado por departamento Altas demandas exitoso',
        data: result
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error la bandeja de entrada de altas demandas por departamento'
      }, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('list-receive')
  async listReceiveHighDemands(@Query() params: any) {
    try {
      const { rolId, placeTypeId } = params
      const result = await this.highDemandService.listReceived(rolId, placeTypeId)
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

  @Get('action-roles/:rolId')
  async getActionsFromRoles(@Param('rolId', ParseIntPipe) rolId: number) {
    try {
      const result = await this.highDemandService.getRolesToGo(rolId)
      return {
        status: 'success',
        message: 'Se ha obtenido exitosamente las acciones de los roles',
        data: result
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al obtener acciones de roles'
      }, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('list-high-demands-approved')
  async getHighDemandsApproved() {
    try {
      const result = await this.highDemandService.listHighDemandsApproved()
      return {
        status: 'success',
        message: 'Se ha obtenido las Altas Demandas aprobadas exitosamente',
        data: result
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al obtener las altas demandas aprobadas'
      }, HttpStatus.BAD_REQUEST)
    }
  }



  @UseGuards(JwtAuthGuard)
  @Get(':id/receive')
  async receiveHighDemand(
    @Param('id', ParseIntPipe) id: number,
    @User('id') userId: number
  ) {
    try {
      const result = await this.highDemandService.receiveHighDemand(id, userId)
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



  @Get(':id/by-institution')
  getHighDemandByInstitution(@Param('id') id: number) {
    return this.highDemandService.getHighDemandRegistration(id)
  }

  @Post('udpate-state-worfkflow')
  updateStateWorkflow(@Body() body: CreateHistoryDto) {
    return this.highDemandService.modifyWorkflowStatus(body)
  }

  @Post('cancel')
  async updateRegistrationStatus(@Body() body: any) {
    try {
      const result = await this.highDemandService.cancelHighDemand(body)
      return {
        status: 'success',
        message: 'Alta demanda anulada exitosamente',
        data: result
      }
    } catch(error){
      throw new HttpException({
        status: 'error',
        message: error.message || 'No se pudó anular la alta demanda'
      }, HttpStatus.BAD_REQUEST)
    }
  }

}