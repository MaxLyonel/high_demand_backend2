import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";

import { LoginDto } from "@access-control/application/dtos/login.dto";
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
  async login(@Body() loginDto: LoginDto, @Request() req) {
    console.log("request user?", req.user)
    return this.authService.login(req.user)
  }

  @UseGuards(JwtAuthGuard, CaslGuard)
  @Get('profile')
  @CheckAbilities({ action: 'read', subject: 'user'})
  getProfile(@Request() req) {
    return req.user
  }
}