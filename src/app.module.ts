// framework nestjs
import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
// own implementations
import { AuthModule } from "./modules/access-control/auth.module";
import { DatabaseModule } from "./infrastructure/database/database.module";
import { HighDemandModule } from "./modules/high-demand/high-demand.module";
import { OperationsProgrammingModule } from "./modules/operations-programming/operations-programming.module";
import { PreRegistrationModule } from "./modules/pre-registration/pre-registration.module";
import { ConstantModule } from "@infrastructure-general/constants/constant.module";
import { AddInfoMiddleware } from "@high-demand/infrastructure/adapters/primary/middleware/add-info.middleware";

@Module({
  imports: [
    AuthModule,
    ConstantModule,
    DatabaseModule,
    HighDemandModule,
    PreRegistrationModule,
    OperationsProgrammingModule
  ]
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AddInfoMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL }); // o rutas específicas
  }
}