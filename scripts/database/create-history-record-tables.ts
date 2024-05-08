import "reflect-metadata";
import dotenv from 'dotenv';
import * as assert from 'assert';
import { SettingsService } from '../../src/settings/settings.service';
import { Logger } from '@nestjs/common';
import { getSequelizeDbConnectionPropertiesConfig } from "src/db/sequelize.config";
import { Sequelize } from "sequelize";


const logger = new Logger('Script create-history-record-tables');
logger.log('Запуск скрипта создания таблиц, хранящих запись истории TOI для ретрансляции');


// --- Загружаем настройки
dotenv.config();


// --- Инициализируем базу
const dbConfig = getSequelizeDbConnectionPropertiesConfig(process.env.dbUri);
const sequelize = new Sequelize({
  database: dbConfig.protocol,
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
const historyRecordTablesNumber = parseInt(process.env.HISTORY_RECORD_TABLES_NUMBER ?? '0');
assert(historyRecordTablesNumber > 0, "Количество таблиц записи для истории TOI должно быть больше нуля!");

// --- Список таблиц истории для третички
const historyTableNames = Array.from(
  { length: historyRecordTablesNumber },
  (_, index) => SettingsService.getRecordHistoryTableNameByIndex(index)
);

// --- Список таблиц актуальной третички
const toiActualTableNames = Array.from(
  { length: historyRecordTablesNumber },
  (_, index) => SettingsService.getToiActualTableNameByIndex(index)
);


// --- Таблицы записи третички из истории
const deleteHistoryRecordTables = async () => {
  logger.log('Удалим таблицы истории перед созданием');

  let promises: Array<Promise<any>> = [];

  historyTableNames.forEach(it => {
    const dropResult = sequelize.query(`
      DROP TABLE IF EXISTS ${it};
    `);
    promises.push(dropResult);
  });

  try {
    await Promise.all(promises);
    logger.log('Таблицы удалены');
  } catch (e) {
    logger.log('Не смогли дропнуть все таблицы!', e.message);
    assert(false, 'Нет смысла работать дальше, проверьте причину неудачного удаления таблиц');
  }
  return promises;
}

const createHistoryRecordTables = async () => {
  logger.log('Пробуем создать таблицы записи истории TOI');

  let promises: Array<Promise<any>> = [];
  historyTableNames.forEach((it, _) => {
    const sql = `CREATE TABLE IF NOT EXISTS ${it} (
      id int(11) NOT NULL AUTO_INCREMENT,
      Number smallint(6) NOT NULL,
      time datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
      X int(11) NOT NULL DEFAULT '0',
      Y int(11) NOT NULL DEFAULT '0',
      H smallint(6) NOT NULL DEFAULT '0',
      CRS float NOT NULL DEFAULT '0',
      id_Sintez smallint(6) NOT NULL DEFAULT '0',
      Name varchar(25) COLLATE utf8mb4_unicode_ci NOT NULL,
      faza tinyint(3) unsigned NOT NULL,
      Source_ID smallint(6) NOT NULL DEFAULT '0',
      Type_of_Msg tinyint(3) unsigned NOT NULL DEFAULT '0',
      Speed float NOT NULL DEFAULT '0',
      FP_Callsign varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT '',
      tobtg varchar(25) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
      FP_TypeAirCraft varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT '',
      tow varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
      FP_Stand varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT '',
      airport_code varchar(25) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
      taxi_out varchar(25) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
      ata varchar(25) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
      regnum varchar(25) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
      PRIMARY KEY (id)
    );`

    logger.log('Создаём таблицу', it);
    const createTableResult = sequelize.query(sql);
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


// --- Таблицы актуальной третички по записи из истории
const deleteToiActualTables = async () => {
  logger.log('Удалим таблицы актуальной третички по истории перед созданием');

  let promises: Array<Promise<any>> = [];

  toiActualTableNames.forEach(it => {
    const dropResult = sequelize.query(`
      DROP TABLE IF EXISTS >${it};
    `);
    promises.push(dropResult);
  });

  try {
    await Promise.all(promises);
    logger.log('Таблицы удалены');
  } catch (e) {
    logger.log('Не смогли дропнуть все таблицы!', e.message);
    assert(false, 'Нет смысла работать дальше, проверьте причину неудачного удаления таблиц');
  }
  return promises;
}

const createToiActualTables = async () => {
  logger.log('Пробуем создать таблицы актуальной третички по истории TOI');

  let promises: Array<Promise<any>> = [];
  toiActualTableNames.forEach((it, _) => {
    const sql = `CREATE TABLE IF NOT EXISTS ${it} (
      id int NOT NULL AUTO_INCREMENT,
      Number smallint NOT NULL,
      X int NOT NULL DEFAULT '0',
      Y int NOT NULL DEFAULT '0',
      H smallint NOT NULL DEFAULT '0',
      CRS float NOT NULL DEFAULT '0',
      id_Sintez smallint NOT NULL DEFAULT '0',
      Name varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
      faza tinyint unsigned NOT NULL,
      Source_ID smallint NOT NULL DEFAULT '0',
      Type_of_Msg tinyint unsigned NOT NULL DEFAULT '0',
      Speed float NOT NULL DEFAULT '0',
      FP_Callsign varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '',
      tobtg varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
      FP_TypeAirCraft varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '',
      tow varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
      FP_Stand varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '',
      airport_code varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
      taxi_out varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
      ata varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
      regnum varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
      PRIMARY KEY (id),
      KEY Number_IDX (Number) USING BTREE
    );`

    logger.log('Создаём таблицу', it);
    const createTableResult = sequelize.query(sql);
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


// ---
(async () => {
  await deleteHistoryRecordTables();
  await createHistoryRecordTables();

  await deleteToiActualTables();
  await createToiActualTables();

  logger.log('Окончание работы скрипта создания таблиц, хранящих запись истории TOI и и актуальную третичку по записи для ретрансляции');
})();
