import { Body, Controller, Get, HttpException, HttpStatus, Post } from "@nestjs/common";
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

  @Get('list')
  async listPreRegistration() {
    try {
      const result = await this.preRegistrationService.listPreRegistration()
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
}