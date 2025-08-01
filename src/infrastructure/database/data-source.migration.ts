// external dependencies
import { DataSource } from "typeorm";
// own implementations
import { dataSourceHD } from "./data-source";

export const AppDataSource = new DataSource(dataSourceHD);
