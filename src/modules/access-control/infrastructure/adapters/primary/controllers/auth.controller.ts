// framework nestjs
import { Controller, Get, HttpException, HttpStatus, Post, Query, Request, UseGuards } from "@nestjs/common";
// own implementations
import { AuthService } from "@access-control/domain/ports/inbound/auth.service"
import { LocalAuthGuard } from "../guards/local-auth.guard";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { CaslGuard } from "../guards/casl.guard";
import { CheckAbilities } from "../decorators/abilities.decorator";
import { LoginResponseDto } from "../dtos/response/login-response.dto";
import { LoginRequestDto } from "../dtos/request/login-request.dto";
import { TeacherRequestDto } from "../dtos/request/teacher-request.dto";
import { TeacherResponseDto } from "../dtos/response/teacher-response.dto";


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: LoginRequestDto): Promise<LoginResponseDto> {
    return this.authService.login(req.user)
  }

  @UseGuards(JwtAuthGuard, CaslGuard)
  @Get('profile')
  // @CheckAbilities({ action: 'read', subject: 'user'})
  getProfile(@Request() req: LoginRequestDto): Promise<LoginRequestDto> {
    return req.user
  }

  @UseGuards(JwtAuthGuard, CaslGuard)
  @Get('info-teacher')
  // @CheckAbilities({ action: 'read', subject: 'user'})
  async getTeacher(@Query() query: TeacherRequestDto): Promise<TeacherResponseDto> {
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