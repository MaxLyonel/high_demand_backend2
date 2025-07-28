import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { envs } from "src/infrastructure/config";
import { AuthService } from "src/modules/login/application/ports/inbound/auth.service";
import { TokenService } from "src/modules/login/application/ports/outbound/token.service";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly tokenService: TokenService,
    private readonly authService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envs.jwtSecret || 'secretKey',
    });
  }

  async validate(payload: any) {
    const user = await this.authService.getProfile(payload.userId);
    if(!user) {
      throw new Error('Usuario no encontrado')
    }
    return user;
  }

}