import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post } from "@nestjs/common";
import { OperationsProgrammingService } from "src/modules/operations-programming/domain/ports/inbound/operations-programming.service";


@Controller('operative')
export class OperativeController {

  constructor(
    private readonly operativeService: OperationsProgrammingService
  ) {}

  @Get('/:gestionId')
  async getOperative(@Param('gestionId', ParseIntPipe) gestionId: number) {
    try {
      const result = await this.operativeService.getRegisterOperative(gestionId)
      return {
        status: 'success',
        message: 'Se obtuvo exitosamente el operativo',
        data: result
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al obtener el operativo'
      }, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('create')
  async createOperative(@Body() body: any) {
    try {
      const result = await this.operativeService.registerOpertive(body)
      return {
        status: 'success',
        message: 'Se creó el operativo exitosamente',
        data: result
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al crear el operativo'
      }, HttpStatus.BAD_REQUEST)
    }
  }
}