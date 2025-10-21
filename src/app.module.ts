// framework nestjs
import { Global, MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
// own implementations
import { AuthModule } from "./modules/access-control/auth.module";
import { DatabaseModule } from "./infrastructure/database/database.module";
import { HighDemandModule } from "./modules/high-demand/high-demand.module";
import { OperationsProgrammingModule } from "./modules/operations-programming/operations-programming.module";
import { PreRegistrationModule } from "./modules/pre-registration/pre-registration.module";
import { ConstantModule } from "@infrastructure-general/constants/constant.module";
import { AddInfoMiddleware } from "@high-demand/infrastructure/adapters/primary/middleware/add-info.middleware";
import { JwtAuthGuard } from "@access-control/infrastructure/adapters/primary/guards/jwt-auth.guard";
import { APP_GUARD } from "@nestjs/core";
import { PermissionGuard } from "@access-control/infrastructure/adapters/primary/guards/permission.guard";
import { ScheduleModule } from "@nestjs/schedule";

@Global()
@Module({
  imports: [
    AuthModule,
    ConstantModule,
    DatabaseModule,
    HighDemandModule,
    PreRegistrationModule,
    OperationsProgrammingModule,
    ScheduleModule.forRoot(),
  ],
  providers: [
    {
      provide: APP_GUARD, // ✅ Aplicar guard JWT globalmente
      useClass: JwtAuthGuard
    },
    // {
    //   provide: APP_GUARD, // ✅ Aplicar guar Permissions globalmente
    //   useClass: PermissionGuard
    // },
  ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AddInfoMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL }); // o rutas específicas
  }
}