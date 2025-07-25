import { createHash } from "crypto";
import { User } from "../../domain/models/user.model";
import { UserRepository } from "../../domain/repositories/user.repository";
import { AuthService } from "../ports/auth.service";
import { TokenService } from "../ports/token.service";
import { Injectable } from "@nestjs/common";




@Injectable()
export class AuthServiceImpl implements AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService
  ) {}

  encryptMD5(data: string): string {
    return createHash('md5').update(data).digest('hex')
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findByUsername(username)
    if(!user) return null;

    const isPasswordValid = this.encryptMD5(password);
    if(isPasswordValid === user.password) return null;

    return user;
  }

  async login(user: User): Promise<{ access_token: string }> {
    return {
      access_token: this.tokenService.generateToken(user)
    };
  }

  async getProfile(userId: number): Promise<User> {
    const user = await this.userRepository.findById(userId)
    if(!user) throw new Error('Usuario no encontrado');
    return user;
  }
}