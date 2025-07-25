import { Module } from "@nestjs/common";
import { AuthModule } from "./modules/auth/infrastructure/auth.module";
import { DatabaseModule } from "./infrastructure/database/database.module";



@Module({
  imports: [
    AuthModule,
    DatabaseModule
  ]
})
export class AppModule {}