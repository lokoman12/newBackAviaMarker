import "reflect-metadata";
import * as dotenv from 'dotenv';
import * as assert from 'assert';
import { Logger } from '@nestjs/common';
import { getSequelizeDbConnectionPropertiesConfig } from "src/db/sequelize.config";
import { Sequelize } from "sequelize";
import * as path from 'path';
import { isString, isArray } from 'lodash';
import { AZNB_HISTORY_TABLE_NAME, HISTORY_TEMPLATE_TOKEN, METEO_HISTORY_TABLE_NAME, OMNICOM_HISTORY_TABLE_NAME, STANDS_HISTORY_TABLE_NAME, TOI_HISTORY_TABLE_NAME } from "src/history/consts";
import { SettingsService } from "src/settings/settings.service";

const logger = new Logger('Script create-history-record-tables');
logger.log('Запуск скрипта создания таблиц, хранящих запись истории TOI для ретрансляции');

// --- Загружаем настройки
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// --- Инициализируем базу
const dbConfig = getSequelizeDbConnectionPropertiesConfig(process.env.dbUri);
logger.log(dbConfig);
const sequelize = new Sequelize({
  database: dbConfig.database,
  protocol: dbConfig.protocol,
  dialect: dbConfig.dialect,
  username: dbConfig.username,
  password: dbConfig.password,
  host: dbConfig.host,
  port: dbConfig.port,
  pool: {
    max: 2,
    min: 1,
    acquire: 30000,
    idle: 5000,
  },
  // logging: (sql, options) => {
  //   // Фильтруем запросы только для конкретной таблицы
  //   if (sql.includes('permission')) {
  //     console.log(sql); // Логируем запрос
  //   }
  // },
});


// --- Количество таблиц
const historyRecordTablesNumber = parseInt(process.env.historyRecordTablesNumber ?? '0');
assert(historyRecordTablesNumber > 0, "Количество таблиц записи для истории TOI должно быть больше нуля!");


console.log('SettingsService', SettingsService);
// --- Список таблиц истории для третички
const toiHistoryTableNames = Array.from(
  { length: historyRecordTablesNumber },
  (_, index) => SettingsService.getRecordTableNameByIndex(TOI_HISTORY_TABLE_NAME, index)
);

// --- Список таблиц истории для метео
const meteoHistoryTableNames = Array.from(
  { length: historyRecordTablesNumber },
  (_, index) => SettingsService.getRecordTableNameByIndex(METEO_HISTORY_TABLE_NAME, index)
);

// --- Список таблиц истории для машинок
const omnicomHistoryTableNames = Array.from(
  { length: historyRecordTablesNumber },
  (_, index) => SettingsService.getRecordTableNameByIndex(OMNICOM_HISTORY_TABLE_NAME, index)
);

// --- Список таблиц истории для парковок
const standsHistoryTableNames = Array.from(
  { length: historyRecordTablesNumber },
  (_, index) => SettingsService.getRecordStandsTableNameByIndex(index)
);

// --- Список таблиц истории для первички
const aznbHistoryTableNames = Array.from(
  { length: historyRecordTablesNumber },
  (_, index) => SettingsService.getRecordAznbTableNameByIndex(index)
);


const dropTableSql = (tableName: string) =>
  `DROP TABLE IF EXISTS ${tableName};`;

  export const commonHistoryAttributes = `
    id int(11) NOT NULL AUTO_INCREMENT,
    time datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
  `;

  export const toiHistoryAttributes = `
  coordinates json NOT NULL,

  Name varchar(255) DEFAULT NULL,
  curs float NOT NULL,
  alt float NOT NULL,
  faza int(11) NOT NULL,
  Number int(11) NOT NULL,
  type int(11) NOT NULL,

  formular json NOT NULL,
`;

const createMainToiHistorySql = (tableName: string) =>
  `CREATE TABLE IF NOT EXISTS ${tableName} (
  ${commonHistoryAttributes}
  ${toiHistoryAttributes}

  PRIMARY KEY (id),
  KEY time_idx (time)
);`;

const createRelativeToiHistorySql = (tableName: string) =>
  `CREATE TABLE IF NOT EXISTS ${tableName} (
  id int(11) NOT NULL AUTO_INCREMENT,
  step int(11) NOT NULL,
  time datetime(3) DEFAULT CURRENT_TIMESTAMP(3),

  coordinates json NOT NULL,

  Name varchar(255) DEFAULT NULL,
  curs float NOT NULL,
  alt float NOT NULL,
  faza int(11) NOT NULL,
  Number int(11) NOT NULL,
  type int(11) NOT NULL,

  formular json NOT NULL,

  PRIMARY KEY (id),
  KEY step (step),
  KEY time_idx (time)
);`;

const createMainOmnicomHistorySql = (tableName: string) =>
  `CREATE TABLE IF NOT EXISTS ${tableName} (
  id int(11) NOT NULL AUTO_INCREMENT,
  time datetime(3) DEFAULT CURRENT_TIMESTAMP(3),

  Serial varchar(10) NOT NULL,
  GarNum varchar(20) DEFAULT NULL,
  t_obn double DEFAULT NULL,

  Lat double DEFAULT NULL,
  Lon double DEFAULT NULL,
  
  Speed float DEFAULT NULL,
  Course float DEFAULT NULL,

  PRIMARY KEY (id),
  KEY time_idx (time)
)`;

const createRelativeOmnicomHistorySql = (tableName: string) =>
  `CREATE TABLE IF NOT EXISTS ${tableName} (
  id int(11) NOT NULL AUTO_INCREMENT,
  step int(11) NOT NULL,
  time datetime(3) DEFAULT CURRENT_TIMESTAMP(3),

  Serial varchar(10) NOT NULL,
  GarNum varchar(20) DEFAULT NULL,
  t_obn double DEFAULT NULL,

  Lat double DEFAULT NULL,
  Lon double DEFAULT NULL,
  
  Speed float DEFAULT NULL,
  Course float DEFAULT NULL,

  PRIMARY KEY (id),
  KEY step (step),
  KEY time_idx (time)
)`;

export const meteoHistoryAttributes = `
  dTime double NOT NULL,
  id_vpp tinyint(4) NOT NULL,
  id_grp int(11) NOT NULL,
  Data varchar(512) DEFAULT NULL,
`;
const createMainMeteoHistorySql = (tableName: string) =>
  `CREATE TABLE IF NOT EXISTS ${tableName} (
  id int(11) NOT NULL AUTO_INCREMENT,
  time datetime(3) DEFAULT CURRENT_TIMESTAMP(3),

  ${meteoHistoryAttributes}
  
  PRIMARY KEY (id),
  KEY time_idx (time)
)`;

const createRelativeMeteoHistorySql = (tableName: string) =>
  `CREATE TABLE IF NOT EXISTS ${tableName} (
  id int(11) NOT NULL AUTO_INCREMENT,
  step int(11) NOT NULL,
  time datetime(3) DEFAULT CURRENT_TIMESTAMP(3),

  ${meteoHistoryAttributes}
  
  PRIMARY KEY (id),
  KEY step (step),
  KEY time_idx (time)
)`;

const createMainStandsHistorySql = (tableName: string) =>
  `CREATE TABLE IF NOT EXISTS ${tableName} (
    id int (11) NOT NULL AUTO_INCREMENT,
    time datetime DEFAULT NULL,

    id_st varchar(50) NOT NULL DEFAULT '',
    calls_arr varchar(50) DEFAULT NULL,
    calls_dep varchar(50) DEFAULT NULL,
    close tinyint (4) DEFAULT NULL,

    PRIMARY KEY (id),
    KEY time (time)
)`;

const createRelativeStandsHistorySql = (tableName: string) =>
  `CREATE TABLE IF NOT EXISTS ${tableName} (
    id int (11) NOT NULL AUTO_INCREMENT,
    step int(11) NOT NULL,
    time datetime DEFAULT NULL,

    id_st varchar(50) NOT NULL DEFAULT '',
    calls_arr varchar(50) DEFAULT NULL,
    calls_dep varchar(50) DEFAULT NULL,
    close tinyint (4) DEFAULT NULL,

    PRIMARY KEY (id),
    KEY step (step),
    KEY time (time)
)`;

const createMainAznbHistorySql = (tableName: string) =>
  `CREATE TABLE IF NOT EXISTS ${tableName} (
      id int (11) NOT NULL AUTO_INCREMENT,
      time datetime DEFAULT NULL,

      Id_Tr varchar(25) DEFAULT '',
      trs_adress int(10) unsigned NOT NULL DEFAULT '0',
      B double NOT NULL DEFAULT '0',
      L double NOT NULL DEFAULT '0',
      H smallint (6) NOT NULL DEFAULT '0',
      V_grd double NOT NULL DEFAULT '0',
      PA tinyint (4) NOT NULL DEFAULT '0',

      PRIMARY KEY (id),
      KEY time (time)
  )`;

const createRelativeAznbHistorySql = (tableName: string) =>
  `CREATE TABLE IF NOT EXISTS ${tableName} (
      id int (11) NOT NULL AUTO_INCREMENT,
      step int(11) NOT NULL,
      time datetime DEFAULT NULL,

      Id_Tr varchar(25) DEFAULT '',
      trs_adress int(10) unsigned NOT NULL DEFAULT '0',
      B double NOT NULL DEFAULT '0',
      L double NOT NULL DEFAULT '0',
      H smallint (6) NOT NULL DEFAULT '0',
      V_grd double NOT NULL DEFAULT '0',
      PA tinyint (4) NOT NULL DEFAULT '0',

      PRIMARY KEY (id),
      KEY step (step),
      KEY time (time)
  )`;

// --- Таблицы записи третички из истории
const deleteHistoryRecordTables = async (tableNames: Array<string> | string, getSql: (tableName: string) => string) => {
  logger.log('Удалим таблицы истории перед созданием');

  let promises: Array<Promise<any>> = [];

  // Имя таблицы или список имён таблиц
  if (isString(tableNames)) {
    const dropResult = sequelize.query(getSql(tableNames));
    promises.push(dropResult);
  } else if (isArray(tableNames)) {
    tableNames.forEach(it => {
      const dropResult = sequelize.query(getSql(it));
      promises.push(dropResult);
    });
  }

  logger.log(`Промисы для удаления: ${promises.length}`);
  try {
    await Promise.all(promises);
    logger.log('Таблицы удалены');
  } catch (e) {
    logger.log('Не смогли дропнуть все таблицы!', e.message);
    assert(false, 'Нет смысла работать дальше, проверьте причину неудачного удаления таблиц');
  }
  return promises;
}

const prepareHistoryTables = async (
  tableNames: Array<string> | string,
  getDeleteSql: (tableNames: string) => string,
  getCreateSql: (tableNames: string) => string) => {
  await deleteHistoryRecordTables(tableNames, getDeleteSql);
  await createHistoryRecordTables(tableNames, getCreateSql);
}

const prepareMainAndRelativesHistoryTables = async (
  mainTableName: string,
  relativeTableNames: Array<string>,
  getDeleteSql: (tableNames: string) => string,
  getMainCreateSql: (tableNames: string) => string,
  getRelativeCreateSql: (tableNames: string) => string) => {
  await prepareHistoryTables(mainTableName, getDeleteSql, getMainCreateSql);
  await prepareHistoryTables(relativeTableNames, getDeleteSql, getRelativeCreateSql);
}

const createHistoryRecordTables = async (tableNames: Array<string> | string, getSql: (tableName: string) => string) => {
  logger.log('Пробуем создать таблицы записи истории');

  let promises: Array<Promise<any>> = [];

  // Имя таблицы или список имён таблиц
  if (isString(tableNames)) {
    const createTableResult = sequelize.query(getSql(tableNames));
    promises.push(createTableResult);
  } else if (isArray(tableNames)) {
    tableNames.forEach((it, _) => {
      logger.log('Создаём таблицу', it);
      const createTableResult = sequelize.query(getSql(it));
      promises.push(createTableResult);
      return promises;
    });
  }

  try {
    await Promise.all(promises);
    logger.log('Таблицы созданы');
  } catch (e) {
    logger.log('Не смогли создать все таблицы!', e.message);
    assert(false, 'Нет смысла работать дальше, проверьте причину неудачного создания таблиц');
  }
};

(async () => {
  // Таблицу истории третички не чистим по умолчанию, пусть копится
  // await prepareHistoryTables(TOI_HISTORY_TABLE_NAME, dropTableSql, createMainToiHistorySql);
  await prepareHistoryTables(toiHistoryTableNames, dropTableSql, createRelativeToiHistorySql);

  await prepareMainAndRelativesHistoryTables(
    METEO_HISTORY_TABLE_NAME, meteoHistoryTableNames,
    dropTableSql, createMainMeteoHistorySql, createRelativeMeteoHistorySql
  );

  await prepareMainAndRelativesHistoryTables(
    OMNICOM_HISTORY_TABLE_NAME, omnicomHistoryTableNames,
    dropTableSql, createMainOmnicomHistorySql, createRelativeOmnicomHistorySql
  );

  await prepareMainAndRelativesHistoryTables(
    STANDS_HISTORY_TABLE_NAME, standsHistoryTableNames,
    dropTableSql, createMainStandsHistorySql, createRelativeStandsHistorySql
  );

  await prepareMainAndRelativesHistoryTables(
    AZNB_HISTORY_TABLE_NAME, aznbHistoryTableNames,
    dropTableSql, createMainAznbHistorySql, createRelativeAznbHistorySql
  );

  logger.log('Окончание работы скрипта создания таблиц, хранящих запись истории TOI и и актуальную третичку по записи для ретрансляции');
  process.exit(0);
})();
