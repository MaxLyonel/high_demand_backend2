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
import { PermissionRepositoryImpl } from "./infrastructure/adapters/secondary/persistence/repositories/permission.repository.impl";
import { PermissionRepository } from "./application/ports/outbound/permission.repository";
import { ActionEntity } from "./infrastructure/adapters/secondary/persistence/entities/action.entity";
import { ConditionEntity } from "./infrastructure/adapters/secondary/persistence/entities/condition.entity";
import { PermissionEntity } from "./infrastructure/adapters/secondary/persistence/entities/permission.entity";
import { ResourceEntity } from "./infrastructure/adapters/secondary/persistence/entities/resource.entity";
import { RolPermissionEntity } from "./infrastructure/adapters/secondary/persistence/entities/rol-permission.entity";
import { RolTypeEntity } from "./infrastructure/adapters/secondary/persistence/entities/rol-type.entity";
import { AbilityFactory } from "./application/services/ability.factory";
import { UserController } from "./infrastructure/adapters/primary/controllers/user.controller";
import { TeacherEntity } from "./infrastructure/adapters/secondary/persistence/entities/teacher.entity";


@Module({
  controllers: [AuthController, UserController],
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
    {
      provide: PermissionRepository,
      useClass: PermissionRepositoryImpl
    },
    LocalStrategy,
    JwtStrategy,
    AbilityFactory
  ],
  imports: [
    PassportModule,
    JwtModule.register({
      secret: envs.jwtSecret,
      signOptions: { expiresIn: envs.expiresIn },
    }),
    TypeOrmModule.forFeature([
      UserEntity,
      ActionEntity,
      ConditionEntity,
      PermissionEntity,
      ResourceEntity,
      RolPermissionEntity,
      RolTypeEntity,
      TeacherEntity
    ], 'alta_demanda'),
  ],
  exports: [AuthService, TokenService, PermissionRepository]
})
export class AuthModule {}