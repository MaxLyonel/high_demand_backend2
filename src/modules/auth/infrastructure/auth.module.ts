import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { envs } from "src/infrastructure/config";
import { UserEntity } from "./adapters/secondary/persistence/entities/user.entity";
import { AuthController } from "./adapters/primary/controllers/auth.controller";
import { AuthServiceImpl } from "../application/services/auth.service.impl";
import { TokenServiceImpl } from "../application/services/token.service.impl";
import { LocalStrategy } from "./adapters/primary/strategies/local.strategy";
import { JwtStrategy } from "./adapters/primary/strategies/jwt.strategy";
import { UserRepositoryImpl } from "./adapters/secondary/persistence/repositories/user.repository.impl";
import { AuthService } from '../application/ports/auth.service';
import { TokenService } from '../application/ports/token.service';
import { UserRepository } from "../domain/repositories/user.repository";




@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl
    },
    {
      provide: AuthService,
      useClass: AuthServiceImpl
    },
    {
      provide: TokenService,
      useClass: TokenServiceImpl
    },
    LocalStrategy,
    JwtStrategy
  ],
  imports: [
    PassportModule,
    JwtModule.register({
      secret: envs.jwtSecret,
      signOptions: { expiresIn: envs.expiresIn },
    }),
    TypeOrmModule.forFeature([UserEntity], 'alta_demanda'),
  ],
  exports: [AuthService, TokenService]
})
export class AuthModule {}