// framework nestjs
import { Global, Module } from "@nestjs/common";
// external dependencies
import { TypeOrmModule } from "@nestjs/typeorm";
// own implementations
import { dataSourceHD } from "./data-source";


@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dataSourceHD,
      name: 'alta_demanda',
      autoLoadEntities: true
    })
  ],
  exports: [TypeOrmModule]
})
export class DatabaseModule {}