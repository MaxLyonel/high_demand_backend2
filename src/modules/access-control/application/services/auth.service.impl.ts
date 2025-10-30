// framework nestjs
import { Injectable } from "@nestjs/common";
// subject depedencies
import { createHash } from "crypto";
// own implementations
import { User } from "@access-control/domain/models/user.model";
import { UserRepository } from "../../domain/ports/outbound/user.repository";
import { AuthService } from "../../domain/ports/inbound/auth.service";
import { TokenService } from "../../domain/ports/outbound/token.service";
import { Teacher } from "@access-control/domain/models/teacher.model";




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
    if(isPasswordValid !== user.password) return null; // aqui cambiar por !== para login

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

  async getTeacher(personId: number, gestionId: number): Promise<Teacher | null> {
    const teacher = await this.userRepository.getTeacherInfo(personId, gestionId)
    if(!teacher) throw new Error('Maestro no encontrado');
    return teacher;
  }
}