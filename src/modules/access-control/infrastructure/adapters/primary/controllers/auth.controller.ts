import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, Request, UseGuards } from "@nestjs/common";

import { AuthService } from "@access-control/application/ports/inbound/auth.service"
import { LocalAuthGuard } from "../guards/local-auth.guard";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { CaslGuard } from "../guards/casl.guard";
import { CheckAbilities } from "../decorators/abilities.decorator";


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: any, @Request() req) {
    return this.authService.login(req.user)
  }

  @UseGuards(JwtAuthGuard, CaslGuard)
  @Get('profile')
  // @CheckAbilities({ action: 'read', subject: 'user'})
  getProfile(@Request() req) {
    return req.user
  }

  @UseGuards(JwtAuthGuard, CaslGuard)
  @Get('info-teacher')
  // @CheckAbilities({ action: 'read', subject: 'user'})
  async getTeacher(@Query() query: { personId: number, gestionId: number}) {
    try {
      const { personId, gestionId } = query
      const result = await this.authService.getTeacher(personId, gestionId)
      return {
        status: 'success',
        message: 'Informacion del maestro obtenida exitosamente',
        data: result
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al obtener informacion del maestro'
      }, HttpStatus.BAD_REQUEST)
    }
  }
}