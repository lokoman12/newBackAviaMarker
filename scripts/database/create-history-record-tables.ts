import "reflect-metadata";
import * as dotenv from 'dotenv';
import * as assert from 'assert';
import { SettingsService } from '../../src/settings/settings.service';
import { Logger } from '@nestjs/common';
import { getSequelizeDbConnectionPropertiesConfig } from "src/db/sequelize.config";
import { Sequelize } from "sequelize";
import * as path from 'path';

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


// --- Список таблиц истории для третички
const toiHistoryTableNames = Array.from(
  { length: historyRecordTablesNumber },
  (_, index) => SettingsService.getRecordHistoryTableNameByIndex(index)
);

// --- Список таблиц истории для метео
const meteoHistoryTableNames = Array.from(
  { length: historyRecordTablesNumber },
  (_, index) => SettingsService.getRecordMeteoTableNameByIndex(index)
);

// --- Список таблиц истории для омникома
const omnicomHistoryTableNames = Array.from(
  { length: historyRecordTablesNumber },
  (_, index) => SettingsService.getRecordOmnicomTableNameByIndex(index)
);


const dropTableSql = (tableName: string) =>
  `DROP TABLE IF EXISTS ${tableName};`;

const createToiHistorySql = (tableName: string) =>
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

const createOmnicomHistorySql = (tableName: string) =>
  `CREATE TABLE IF NOT EXISTS ${tableName} (
  id int(11) NOT NULL AUTO_INCREMENT,
  step int(11) NOT NULL,
  time datetime(3) DEFAULT CURRENT_TIMESTAMP(3),

  coordinates json NOT NULL,

  Serial varchar(255) NOT NULL,
  GarNum varchar(255) DEFAULT NULL,
  t_obn double DEFAULT NULL,
  
  Speed float DEFAULT NULL,
  Course float DEFAULT NULL,

  PRIMARY KEY (id),
  KEY step (step),
  KEY time_idx (time)
)`;

const createMeteoHistorySql = (tableName: string) =>
  `CREATE TABLE ${tableName} (
  id int(11) NOT NULL AUTO_INCREMENT,
  step int(11) NOT NULL,
  time datetime(3) DEFAULT CURRENT_TIMESTAMP(3),

  id_vpp tinyint(4) NOT NULL,
  id_grp int(11) NOT NULL,
  Data varchar(512) DEFAULT NULL,
  
  PRIMARY KEY (id),
  KEY step (step),
  KEY time_idx (time)
)`;


// --- Таблицы записи третички из истории
const deleteHistoryRecordTables = async (tableList: Array<string>, getSql: (tableName: string) => string) => {
  logger.log('Удалим таблицы истории перед созданием');

  let promises: Array<Promise<any>> = [];

  tableList.forEach(it => {
    const dropResult = sequelize.query(getSql(it));
    promises.push(dropResult);
  });

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

const createHistoryRecordTables = async (historyTableNames: Array<string>, getSql: (tableName: string) => string) => {
  logger.log('Пробуем создать таблицы записи истории TOI');

  let promises: Array<Promise<any>> = [];
  historyTableNames.forEach((it, _) => {
    logger.log('Создаём таблицу', it);
    const createTableResult = sequelize.query(getSql(it));
    promises.push(createTableResult);
    return promises;
  });

  try {
    await Promise.all(promises);
    logger.log('Таблицы созданы');
  } catch (e) {
    logger.log('Не смогли создать все таблицы!', e.message);
    assert(false, 'Нет смысла работать дальше, проверьте причину неудачного создания таблиц');
  }
};

(async () => {
  await deleteHistoryRecordTables(toiHistoryTableNames, dropTableSql);
  await createHistoryRecordTables(toiHistoryTableNames, createToiHistorySql);

  await deleteHistoryRecordTables(meteoHistoryTableNames, dropTableSql);
  await createHistoryRecordTables(meteoHistoryTableNames, createMeteoHistorySql);
  
  await deleteHistoryRecordTables(omnicomHistoryTableNames, dropTableSql);
  console.log(omnicomHistoryTableNames);
  await createHistoryRecordTables(omnicomHistoryTableNames, createOmnicomHistorySql);

  logger.log('Окончание работы скрипта создания таблиц, хранящих запись истории TOI и и актуальную третичку по записи для ретрансляции');
  process.exit(0);
})();
