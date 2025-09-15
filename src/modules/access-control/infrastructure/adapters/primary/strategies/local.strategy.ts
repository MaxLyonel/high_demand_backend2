import { User } from "@access-control/domain/models/user.model";
import { AuthService } from "@access-control/domain/ports/inbound/auth.service";
import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { Strategy } from "passport-local"




@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super()
  }

  async validate(username: string, password: string): Promise<User | null> {
    const user = await this.authService.validateUser(username, password);
    if(!user) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }
    return user;
  }
}
