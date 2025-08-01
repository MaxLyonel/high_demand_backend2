import { Injectable } from "@nestjs/common";

// external dependencies
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

// onw implementations
import { envs } from "@infrastructure-general/config"
import { AuthService } from "@access-control/application/ports/inbound/auth.service"
import { TokenService } from "@access-control/application/ports/outbound/token.service"


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