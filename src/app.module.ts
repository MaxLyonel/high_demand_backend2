// framework nestjs
import { Module } from "@nestjs/common";
// own implementations
import { AuthModule } from "./modules/access-control/auth.module";
import { DatabaseModule } from "./infrastructure/database/database.module";
import { HighDemandModule } from "./modules/high-demand/high-demand.module";
import { OperationsProgrammingModule } from "./modules/operations-programming/operations-programming.module";
import { PreRegistrationModule } from "./modules/pre-registration/pre-registration.module";
import { ConstantModule } from "@infrastructure-general/constants/constant.module";

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
export class AppModule {}