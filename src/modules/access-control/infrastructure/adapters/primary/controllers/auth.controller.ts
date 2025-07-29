import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { LoginDto } from "src/modules/access-control/application/dtos/login.dto";
import { AuthService } from "src/modules/access-control/application/ports/inbound/auth.service";
import { LocalAuthGuard } from "../guards/local-auth.guard";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Request() req) {
    return this.authService.login(req.user)
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user
  }
}