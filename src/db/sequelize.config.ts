import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { DbConnectionPropertiesType } from './types';
import { DATABASE_URL_REGEX } from 'src/environment/is.database.url';
import { Dialect } from 'sequelize';
import * as winston from 'winston';
import { utilities } from 'nest-winston';

export const getSequelizeDbUriConfig = (uri: string): SequelizeModuleOptions => {
  return {
    uri,
    define: {
      timestamps: false,
    },
    models: [__dirname + '/models'],
  }
};

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        utilities.format.nestLike('Seqielize', {
          colors: true,
          prettyPrint: true,
          processId: true,
          appName: true,
        }),
      )
    }),
  ],
});

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
      logging: false,//(msg) => logger.info(msg),
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
