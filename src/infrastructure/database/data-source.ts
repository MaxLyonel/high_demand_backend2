import { DataSource, DataSourceOptions } from "typeorm";
import { DbEnvs } from "../config";
import { config } from "dotenv";

config()

export const dataSourceHD: DataSourceOptions = {
  type: 'postgres',
  host: DbEnvs.dbHost,
  port: DbEnvs.dbPort,
  database: DbEnvs.dbName,
  username: DbEnvs.dbUser,
  password: DbEnvs.dbPass,
  // entities: [__dirname + '../../modules/**/**/*.orm-entity.{js,ts}'],
  entities: ["dist/**/*.entity{.ts,.js}"],
  synchronize: false, // cambiar en producción
  applicationName: 'backend-high-demand'
}

// export const HIGH_DEMAND_DB = new DataSource(dataSourceHD)