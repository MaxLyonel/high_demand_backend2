// framework nestjs
import { Global, Module } from "@nestjs/common";
// external dependencies
import { TypeOrmModule } from "@nestjs/typeorm";
// own implementations
import { dataSourceHD } from "./data-source";
import { DataSource } from "typeorm";


@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dataSourceHD,
      name: 'alta_demanda',
      autoLoadEntities: true
    })
  ],
  providers: [{
    provide: 'DATA_SOURCE',
    useFactory: async() => {
      const dataSource = new DataSource(dataSourceHD)
      return dataSource.initialize()
    }
  }],
  exports: [TypeOrmModule, 'DATA_SOURCE']
})
export class DatabaseModule {}