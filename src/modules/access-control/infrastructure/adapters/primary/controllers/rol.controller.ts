import { RolService } from "@access-control/application/ports/inbound/rol.service";
import { Controller, Get, HttpException, HttpStatus } from "@nestjs/common";


@Controller('rol')
export class RolController {

  constructor(
    private readonly rolService: RolService
  ) {}

  @Get('all')
  async getRoles() {
    try {
      const result = await this.rolService.getRoles()
      return {
        status: 'success',
        message: 'Roles obtenidos exitosamente',
        data: result
      }
    } catch (error) {
      console.log(error)
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al obtener los roles'
      }, HttpStatus.BAD_REQUEST)
    }
  }
}