// framework nestjs
import { Injectable } from "@nestjs/common";
// external dependencies
import { JwtService } from "@nestjs/jwt";
// own implementations
import { envs } from "@infrastructure-general/config"
import { User } from "@access-control/domain/models/user.model"
import { TokenService } from '@access-control/domain/ports/outbound/token.service';


@Injectable()
export class TokenServiceImpl implements TokenService {
  private readonly jwtSecret = envs.jwtSecret;
  private readonly expiresIn = envs.expiresIn;

  constructor(private jwtService: JwtService) {}


  generateToken(user: User): string {
    return this.jwtService.sign(
      {
        userId: user.id,
        username: user.username,
        person: user.person,
        roles: user.roles
      }, { expiresIn: this.expiresIn })
  }

  verifyToken(token: string): { userId: string } {
    return { userId: '1' }
    // return this.jwtService.verify(token, this.jwtSecret)
  }
}