import { DataSourceOptions } from "typeorm";
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
  migrations: ["dist/infrastructure/database/migrations/*.js"],
  entities: ["dist/**/*.entity{.ts,.js}"],
  synchronize: false, // cambiar en producción
  applicationName: 'backend-high-demand',
  migrationsTableName: 'alta_demanda.migraciones'
}