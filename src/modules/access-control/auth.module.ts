// framework nestjs
import { Module } from "@nestjs/common";
// external dependencies
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
// own implementation
import { AuthController } from "./infrastructure/adapters/primary/controllers/auth.controller";
import { AuthService } from "./domain/ports/inbound/auth.service";
import { AuthServiceImpl } from "./application/services/auth.service.impl";
import { envs } from "@infrastructure-general/config"
import { JwtStrategy } from "./infrastructure/adapters/primary/strategies/jwt.strategy";
import { LocalStrategy } from "./infrastructure/adapters/primary/strategies/local.strategy";
import { TokenService } from "./domain/ports/outbound/token.service";
import { TokenServiceImpl } from "./infrastructure/adapters/secondary/services/token.service.impl";
import { UserEntity } from "./infrastructure/adapters/secondary/persistence/entities/user.entity";
import { UserRepository } from "./domain/ports/outbound/user.repository";
import { UserRepositoryImpl } from "./infrastructure/adapters/secondary/persistence/repositories/user.repository.impl";
import { PermissionRepositoryImpl } from "./infrastructure/adapters/secondary/persistence/repositories/permission.repository.impl";
import { PermissionRepository } from "./domain/ports/outbound/permission.repository";
import { ActionEntity } from "./infrastructure/adapters/secondary/persistence/entities/action.entity";
import { ConditionEntity } from "./infrastructure/adapters/secondary/persistence/entities/condition.entity";
import { PermissionEntity } from "./infrastructure/adapters/secondary/persistence/entities/permission.entity";
import { ResourceEntity } from "./infrastructure/adapters/secondary/persistence/entities/resource.entity";
import { RolPermissionEntity } from "./infrastructure/adapters/secondary/persistence/entities/rol-permission.entity";
import { RolTypeEntity } from "./infrastructure/adapters/secondary/persistence/entities/rol-type.entity";
import { AbilityFactory } from "./application/services/ability.factory";
import { UserController } from "./infrastructure/adapters/primary/controllers/user.controller";
import { TeacherEntity } from "./infrastructure/adapters/secondary/persistence/entities/teacher.entity";
import { RolController } from "./infrastructure/adapters/primary/controllers/rol.controller";
import { RolRepository } from "./domain/ports/outbound/rol.repository";
import { RolRepositoryImpl } from "./infrastructure/adapters/secondary/persistence/repositories/rol.repository.impl";
import { RolService } from "./domain/ports/inbound/rol.service";
import { RolServiceImpl } from "./application/services/rol.service.impl";
import { PermissionService } from "./domain/ports/inbound/permission.service";
import { PermissionServiceImpl } from "./application/services/permission.service.impl";
import { PermissionController } from "./infrastructure/adapters/primary/controllers/permission.controller";
import { NotificationPort } from "./domain/ports/outbound/notification.service";
import { PermissionsGateway } from "./infrastructure/adapters/secondary/services/websocket.permissions.gateway";


@Module({
  controllers: [AuthController, UserController, RolController, PermissionController],
  providers: [
    PermissionsGateway,
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
    {
      provide: PermissionService,
      useClass: PermissionServiceImpl
    },
    {
      provide: RolRepository,
      useClass: RolRepositoryImpl
    },
    {
      provide: RolService,
      useClass: RolServiceImpl
    },
    {
      provide: NotificationPort,
      useExisting: PermissionsGateway
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