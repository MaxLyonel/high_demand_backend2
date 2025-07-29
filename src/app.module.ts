import { Module } from "@nestjs/common";
import { DatabaseModule } from "./infrastructure/database/database.module";
import { HighDemandModule } from "./modules/high-demand/high-demand.module";
import { AuthModule } from "./modules/access-control/auth.module";
import { OperationsProgrammingModule } from "./modules/operations-programming/operations-programming.module";



@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    HighDemandModule,
    OperationsProgrammingModule
  ]
})
export class AppModule {}