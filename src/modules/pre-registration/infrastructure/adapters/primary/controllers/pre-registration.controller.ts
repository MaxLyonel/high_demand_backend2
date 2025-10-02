import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { PreRegistrationService } from "@pre-registration/domain/ports/inbound/pre-registration.service";



@Controller('pre-registration')
export class PreRegistrationController {

  constructor(
    private readonly preRegistrationService: PreRegistrationService
  ) {}

  @Post('create')
  async createPreRegistration(@Body() body: any) {
    try {
      const result = await this.preRegistrationService.savePreRegistration(body)
      return {
        status: 'success',
        message: 'Pre inscripción creado exitosamente',
        data: result
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al crear el pre inscripción'
      }, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('invalidate')
  async invalidatePreRegistration(@Body() body: any) {
    try {
      const result = await this.preRegistrationService.invalidatePreRegistration(body)
      return {
        status: 'success',
        message: 'Pre inscripción invalidada exitosamente',
        data: result
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al invalidar la pre inscripción'
      }, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('validate')
  async validatePreRegistration(@Body() body: any) {
    try {
      const result = await this.preRegistrationService.validatePreRegistration(body)
      return {
        status: 'success',
        message: 'Pre inscripción validada exitosamente',
        data: result
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al validar la pre inscripción'
      }, HttpStatus.BAD_REQUEST)
    }
  }


  @Post('accept-chosen')
  async acceptChosen(@Body() body: any) {
    try {
      const results = await this.preRegistrationService.acceptPreRegistrations(body)
      return {
        status: 'success',
        message: 'Postulantes aceptados exitosamente',
        data: results
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al aceptar postulantes'
      }, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('list/:highDemandId')
  async listPreRegistration(@Param('highDemandId', ParseIntPipe) sie: number) {
    try {
      const result = await this.preRegistrationService.listPreRegistration(sie)
      return {
        status: 'success',
        message: 'Listado de pre inscripciones obtenido exitosamente',
        data: result
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al obtener las pre inscripciones'
      }, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('list-valid/:highDemandId')
  async listValidPreRegistration(@Param('highDemandId', ParseIntPipe) highDemandId: number) {
    try {
      const result = await this.preRegistrationService.listValidPreRegistrations(highDemandId)
      return {
        status: 'success',
        message: 'Listado de pre inscripciones validas obtenido exitosamente',
        data: result
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al obtener las pre inscripciones validas'
      }, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('list-follow/:identityCardPostulant')
  async listPreRegistrationFollow(@Param('identityCardPostulant') identityCardPostulant: string) {
    try {
      const result = await this.preRegistrationService.listPreRegistrationFollow(identityCardPostulant)
      return {
        status: 'success',
        message: result.length == 0 ? 'No se encontraron resultados' : 'Se encontraron resultados',
        data: result
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al obtener el listado para el seguimiento'
      }, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('update-status/:preRegistrationId')
  async updateStatus(@Param('preRegistrationId', ParseIntPipe) preRegistrationId: number) {
    try {
      const result = await this.preRegistrationService.lotterySelection(preRegistrationId)
      return {
        status: 'success',
        message: 'Postulante seleccionado para la pre inscripción exitosamente',
        data: result
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al actualizar el estado de la preinscripción'
      }, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('accepted-list')
  async getAcceptedList() {
    try {
      const result = await this.preRegistrationService.getPostulantsDrawn()
      return {
        status: 'success',
        message: 'Listado de postulantes aceptados obtenido exitosamente',
        data: result
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al obtener la lista de postulantes aceptados'
      }, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('full-info/:postulantId')
  async getPreRegistrationInfo(@Param('postulantId', ParseIntPipe) postulantId: number) {
    try {
      const result = await this.preRegistrationService.obtainPreRegistrationInformation(postulantId)
      return {
        status: 'success',
        message: 'Información de la preinscripción obtenido exitosamente',
        data: result
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al obtener información del pre registro'
      }, HttpStatus.BAD_REQUEST)
    }
  }
}