// framework nestjs
import { Module } from "@nestjs/common";
// external dependencies
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
// own implementation
import { AuthController } from "./infrastructure/adapters/primary/controllers/auth.controller";
import { AuthService } from "./application/ports/inbound/auth.service";
import { AuthServiceImpl } from "./application/services/auth.service.impl";
import { envs } from "@infrastructure-general/config"
import { JwtStrategy } from "./infrastructure/adapters/primary/strategies/jwt.strategy";
import { LocalStrategy } from "./infrastructure/adapters/primary/strategies/local.strategy";
import { TokenService } from "./application/ports/outbound/token.service";
import { TokenServiceImpl } from "./infrastructure/adapters/secondary/services/token.service.impl";
import { UserEntity } from "./infrastructure/adapters/secondary/persistence/entities/user.entity";
import { UserRepository } from "./application/ports/outbound/user.repository";
import { UserRepositoryImpl } from "./infrastructure/adapters/secondary/persistence/repositories/user.repository.impl";


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