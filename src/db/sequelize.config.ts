import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { DbConnectionPropertiesType } from './types';
import { DATABASE_URL_REGEX } from 'src/environment/is.database.url';
import { Dialect } from 'sequelize';


export const getSequelizeDbUriConfig = (uri: string): SequelizeModuleOptions => {
  return {
    uri,
    define: {
      timestamps: false,
    },
    models: [__dirname + '/models'],
  }
};

export const getSequelizeDbConnectionPropertiesConfig = (uri: string): SequelizeModuleOptions => {
  DATABASE_URL_REGEX
  const matches = DATABASE_URL_REGEX.exec(uri);
  if (matches) {
    let [, dialect, username, password, host, port, database] = matches;
    const connectionProperties: DbConnectionPropertiesType = {
      dialect: dialect as Dialect,
      host,
      port: parseInt(port),
      username,
      password,
      database,
      define: {
        timestamps: false,
      },
    }

    return {
      ...connectionProperties,
      define: {
        timestamps: false,
      },
      models: [__dirname + '/models'],
    }
  } else {
    throw new Error(`Ошибка в урле до базы данных: ${uri}. Првоерьте правильность!`);
  }
};
