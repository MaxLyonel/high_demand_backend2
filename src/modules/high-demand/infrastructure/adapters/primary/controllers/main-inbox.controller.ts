import { JwtAuthGuard } from "@access-control/infrastructure/adapters/primary/guards/jwt-auth.guard";
import { MainInboxService } from "@high-demand/domain/ports/inbound/main-inbox.service";
import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Query, UseGuards } from "@nestjs/common";
import { User } from "../decorators/user.decorator";

@Controller('main-inbox')
export class MainInboxController {
  constructor(
    private readonly mainInboxService: MainInboxService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('receive')
  async receiveHighDemand(
    @Body('highDemandIds') highDemandIds: number[],
    @User('id') userId: number
  ) {
    try {
      const result = await this.mainInboxService.receiveHighDemands(highDemandIds, userId)
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

  @Post('derive')
  async deriveHighDemand(@Body() body: any) {
    try {
      const { highDemandIds, rolId, cite } = body
      const result = await this.mainInboxService.deriveHighDemands(highDemandIds, rolId, cite)
      return {
        status: 'success',
        message: '¡Derivación exitosa!',
        data: result
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al derivar la alta demanda'
      }, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('return')
  async returnHighDemand(@Body() body: any) {
    try {
      const { highDemandIds, rolId, observation } = body
      const result = await this.mainInboxService.returnHighDemand(highDemandIds[0], rolId, observation)
      return {
        status: 'success',
        message: '¡Acción exitosa!',
        data: result
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al devolver la alta demanda'
      }, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('approve')
  async approveHighDemand(@Body() body: any) {
    try {
      const { highDemand } = body
      const result = await this.mainInboxService.approveHighDemand(highDemand)
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
      const { highDemand, observation } = body
      const result = await this.mainInboxService.declineHighDemand(highDemand, observation)
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
      const { rolId, placeTypeId } = params
      const result = await this.mainInboxService.listInbox(rolId, placeTypeId)
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

  @Get('list-receive')
  async listReceiveHighDemands(@Query() params: any) {
    try {
      const { rolId, placeTypeId } = params
      const result = await this.mainInboxService.listReceived(rolId, placeTypeId)
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
      const result = await this.mainInboxService.getRolesToGo(rolId)
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
}