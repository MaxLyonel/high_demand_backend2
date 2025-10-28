// framework nestjs
import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Res } from "@nestjs/common";
// own implementations
import { HighDemandService } from "@high-demand/domain/ports/inbound/high-demand.service"
import { CreateHistoryDto } from "@high-demand/application/dtos/create-history.dto";
import { CreateHighDemandDto } from "@high-demand/application/dtos/create-high-demand.dto";
import { RegisterHighDemandDto } from "@high-demand/application/dtos/register-high-demand.dto";
import { Response } from "express";
import { PdfService } from "@high-demand/domain/ports/outbound/pdf.service";


@Controller('high-demand')
export class HighDemandController {
  constructor(
    private readonly highDemandService: HighDemandService,
    private readonly pdfService: PdfService
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

  @Post('edit')
  async editHighDemandRegistration(@Body() body: any) {
    try {
      const result = await this.highDemandService.editHighDemandRegistration(body)
      return {
        status: 'success',
        message: 'Se modificó la Alta Demanda exitosamente',
        data: result
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al editar la institución como Alta Demanda',
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

  @Get('list-high-demands-approved/:departmentId')
  async getHighDemandsApproved(@Param('departmentId') departmentId: number) {
    try {
      const result = await this.highDemandService.listHighDemandsApproved(departmentId)
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

  @Get('print/:highDemandId')
  async print(
    @Param('highDemandId', ParseIntPipe) highDemandId: number,
    @Res() res: Response
  ) {
    try {
      const response = await this.highDemandService.getHighDemandRegistered(highDemandId)
      await this.pdfService.generateAffidavit(response, res)
    } catch(error) {
      if(!res.headersSent) {
        res.status(HttpStatus.BAD_REQUEST).json({
          status: 'error',
          message: error.message || 'Error al descargar PDF'
        })
      } else {
        console.error('Error después de enviar headers PDF')
      }
    }
  }

  @Get(':id/levels')
  async getHighDemandLevels(@Param('id', ParseIntPipe) id: number) {
    try {
      const response = await this.highDemandService.getHighDemandLevels(id)
      return {
        status: 'success',
        message: 'Niveles obtenidos exitosamente',
        data: response
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al obtener los niveles educativos de la alta demanda',
      }, HttpStatus.BAD_REQUEST)
    }
  }

}