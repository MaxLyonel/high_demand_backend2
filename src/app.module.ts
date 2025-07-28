import { Module } from "@nestjs/common";
import { DatabaseModule } from "./infrastructure/database/database.module";
import { HighDemandModule } from "./modules/high-demand/high-demand.module";
import { AuthModule } from "./modules/login/auth.module";



@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    HighDemandModule
  ]
})
export class AppModule {}