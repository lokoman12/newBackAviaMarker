import { Dialect } from "sequelize";

export type DbConnectionPropertiesType = {
  dialect: Dialect;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  define: {
    timestamps: boolean,
    charset?: string,
    collate?: string,
  },
  dialectOptions?: {
    charset: string,
  },
  logging?: any,
}
