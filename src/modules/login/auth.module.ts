import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { envs } from "src/infrastructure/config";
import { AuthController } from "./infrastructure/adapters/primary/controllers/auth.controller";
import { UserRepository } from "./application/ports/outbound/user.repository";
import { UserRepositoryImpl } from "./infrastructure/adapters/secondary/persistence/repositories/user.repository.impl";
import { AuthService } from "./application/ports/inbound/auth.service";
import { AuthServiceImpl } from "./application/services/auth.service.impl";
import { LocalStrategy } from "./infrastructure/adapters/primary/strategies/local.strategy";
import { JwtStrategy } from "./infrastructure/adapters/primary/strategies/jwt.strategy";
import { UserEntity } from "./infrastructure/adapters/secondary/persistence/entities/user.entity";
import { TokenServiceImpl } from "./infrastructure/adapters/secondary/services/token.service.impl";
import { TokenService } from "./application/ports/outbound/token.service";




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