import { RolService } from "@access-control/domain/ports/inbound/rol.service";
import { Controller, Get, HttpException, HttpStatus } from "@nestjs/common";
import { RolesResponseDto } from "../dtos/response/roles-response.dto";


@Controller('rol')
export class RolController {

  constructor(
    private readonly rolService: RolService
  ) {}

  @Get('all')
  async getRoles(): Promise<RolesResponseDto> {
    try {
      const result = await this.rolService.getRoles()
      return {
        status: 'success',
        message: 'Roles obtenidos exitosamente',
        data: result
      }
    } catch (error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al obtener los roles'
      }, HttpStatus.BAD_REQUEST)
    }
  }
}