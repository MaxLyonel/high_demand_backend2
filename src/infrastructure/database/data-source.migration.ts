// external dependencies
import { DataSource } from "typeorm";
// own implementations
import { dataSourceHD } from "./data-source";

require('module-alias/register');

export const AppDataSource = new DataSource(dataSourceHD);
