import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
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