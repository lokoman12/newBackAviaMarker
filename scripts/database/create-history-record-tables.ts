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
const historyTableNames = Array.from(
  { length: historyRecordTablesNumber },
  (_, index) => SettingsService.getRecordHistoryTableNameByIndex(index)
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

const createHistoryRecordTables = async () => {
  logger.log('Пробуем создать таблицы записи истории TOI');

  let promises: Array<Promise<any>> = [];
  historyTableNames.forEach((it, _) => {
    const sql = `CREATE TABLE IF NOT EXISTS ${it} (
      id int(11) NOT NULL AUTO_INCREMENT,
      step int(11) NOT NULL,
      time datetime(3) DEFAULT CURRENT_TIMESTAMP(3),

      coordinates json NOT NULL,

      Name varchar(255) COLLATE utf8_bin DEFAULT NULL,
      curs float NOT NULL,
      alt float NOT NULL,
      faza int(11) NOT NULL,
      Number int(11) NOT NULL,
      type int(11) NOT NULL,

      formular json NOT NULL,

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

(async () => {
  await deleteHistoryRecordTables();
  await createHistoryRecordTables();

  logger.log('Окончание работы скрипта создания таблиц, хранящих запись истории TOI и и актуальную третичку по записи для ретрансляции');
  process.exit(0);
})();
