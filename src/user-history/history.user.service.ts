import { Injectable, Logger, NotAcceptableException } from "@nestjs/common";
import { CurrentTimeRecord, RecordStatusService, TimelineStartRecordResponse } from "./record.status.service";
import { TimelineRecordDto } from "./timeline.record.dto";
import { METEO_HISTORY_TABLE_NAME, NO_FREE_HISTORY_RECORD_TABLE, OMNICOM_HISTORY_TABLE_NAME, RECORD_SETTING_PROPERTY_NAME, TOI_HISTORY_TABLE_NAME } from "../history/consts";
import ToiHistory from "src/db/models/toiHistory.model";
import { InjectModel } from "@nestjs/sequelize";
import { SettingsService } from "src/settings/settings.service";
import { ApiConfigService } from "src/config/api.config.service";
import { difference, head } from "lodash";
import { DATE_TIME_FORMAT, EMPTY_STRING } from "src/auth/consts";
import dayjs from "../utils/dayjs";
import { HistoryErrorCodeEnum, HistoryBadStateException } from "./user.bad.status.exception";
import OmnicomHistory from "src/db/models/scoutHistory.model";
import MeteoHistory from "src/db/models/meteoHistory.model";


type InsertHistorySqlType = (tableName: string, timeStart: Date, timeEnd: Date) => string;
type DeleteHistorySqlType = (tableName: string) => string;

// В нашем mysql почему-то не работают оконные (over partition) функции
// Потому, чтобы нумеровать строки с одинаковым временем, использую
// @id := if(...)
// Внешний select под insert'ом отбрасывает лишнюю колонку prevTime,
// нужную только для нумерования строк по группам одинакового времени
const ToiHistoryAttributes = 'coordinates, Name, curs, alt, faza, Number, type, formular';
const insertToiHistorySql: InsertHistorySqlType = (tableName: string, timeStart: Date, timeEnd: Date) =>
  `INSERT INTO ${tableName} (
    step, time, 
    ${ToiHistoryAttributes}
  )
  SELECT 	
  step, time, 
  ${ToiHistoryAttributes}
FROM (
  SELECT 
    @id := if(@prev_time = time, @id, @id + 1) AS step,
    @prev_time := time AS prevTime, time,
    ${ToiHistoryAttributes}
  FROM toi_history
  , (select @id := 0, @prev_time := null) AS t
  WHERE Name != '' AND Number != 0 
    AND time <= '${dayjs.utc(timeEnd).format(DATE_TIME_FORMAT)}'
    AND time >= '${dayjs.utc(timeStart).format(DATE_TIME_FORMAT)}'
  ORDER BY time
) history_record`;

const OmnicomHistoryAttributes = 'Serial, GarNum, t_obn, Lat, Lon, Speed, Course';
const insertOmnicomHistorySql: InsertHistorySqlType = (tableName: string, timeStart: Date, timeEnd: Date) =>
  `INSERT INTO ${tableName} (
    step, time, 
    ${OmnicomHistoryAttributes}
  )
  SELECT 	
  step, time, 
  ${OmnicomHistoryAttributes}
FROM (
  SELECT 
    @id := if(@prev_time = time, @id, @id + 1) AS step,
    @prev_time := time AS prevTime, time,
    ${OmnicomHistoryAttributes}
  FROM omnicom_history
  , (select @id := 0, @prev_time := null) AS t
  WHERE time <= '${dayjs.utc(timeEnd).format(DATE_TIME_FORMAT)}'
    AND time >= '${dayjs.utc(timeStart).format(DATE_TIME_FORMAT)}'
  ORDER BY time
) history_record`;

const MeteoHistoryAttributes = 'dTime, id_vpp, id_grp, Data';
const insertMeteoHistorySql: InsertHistorySqlType = (tableName: string, timeStart: Date, timeEnd: Date) =>
  `INSERT INTO ${tableName} (
    step, time, 
    ${MeteoHistoryAttributes}
  )
  SELECT 	
  step, time, 
  ${MeteoHistoryAttributes}
FROM (
  SELECT 
    @id := if(@prev_time = time, @id, @id + 1) AS step,
    @prev_time := time AS prevTime, time,
    ${MeteoHistoryAttributes}
  FROM meteo_history
  , (select @id := 0, @prev_time := null) AS t
  WHERE time <= '${dayjs.utc(timeEnd).format(DATE_TIME_FORMAT)}'
    AND time >= '${dayjs.utc(timeStart).format(DATE_TIME_FORMAT)}'
  ORDER BY time
) history_record`;

const deleteSql: DeleteHistorySqlType = (tableName: string) => `TRUNCATE ${tableName};`;

@Injectable()
class HistoryUserService {
  private readonly logger = new Logger(HistoryUserService.name);

  constructor(
    private readonly settingsService: SettingsService,
    private readonly configService: ApiConfigService,
    private readonly recordStatusService: RecordStatusService,
    @InjectModel(ToiHistory) private readonly toiHistoryModel: typeof ToiHistory,
    @InjectModel(OmnicomHistory) private readonly omnicomHistoryModel: typeof OmnicomHistory,
    @InjectModel(MeteoHistory) private readonly meteoHistoryModel: typeof MeteoHistory
  ) {
    this.logger.log('Сервис инициализирован!')
  }

  async getNextFreeTableNumber() {
    let usedTableNumbers = await this.settingsService
      .getAllSettingsByName(RECORD_SETTING_PROPERTY_NAME);
    usedTableNumbers = usedTableNumbers
      .map(it => parseInt(it.value))
      .filter(it => !isNaN(it)) as Array<number>;

    // Все имеющиеся номера
    const allTableNumbers = Array.from(
      { length: this.configService.getHistoryRecordTablesNumber() },
      (_, index) => index
    ) as Array<number>;
    // Свободные
    const freeTableNumbers = difference(allTableNumbers, usedTableNumbers)
      .sort((x, y) => x - y);

    let nextFreeTableNumber;
    if (freeTableNumbers.length > 0) {
      nextFreeTableNumber = head(freeTableNumbers);
    } else {
      nextFreeTableNumber = NO_FREE_HISTORY_RECORD_TABLE;
    }

    return nextFreeTableNumber
  }

  /**
   * Скопируем в свободную таблицу с заданным индексом tableNumber историю
   * от даты timeStart по дату timeEnd. Таблица должна уже существовать. Даты
   * должны иметь корректный формат
   * @param tableNumber 
   * @param timeStart 
   * @param timeEnd 
   */
  private async prepareUserHistoryTable(
    tableName: string,
    timeStart: Date,
    timeEnd: Date,
    historyModel: typeof ToiHistory | typeof OmnicomHistory | typeof MeteoHistory,
    insertHistorySql: InsertHistorySqlType,
    deleteHistorySql: DeleteHistorySqlType
  ): Promise<void> {
    const deleteSql = deleteHistorySql(tableName);
    this.logger.log(`Предварительно очищаем таблицу ${tableName} перед вставкой истории, ${deleteSql}`);
    try {
      await historyModel.sequelize.query(deleteSql);
    } catch (e) {
      const message = `Ошибка при очистке таблицы ${tableName}`;
      this.logger.error(message, e);
      throw new HistoryBadStateException(EMPTY_STRING, HistoryErrorCodeEnum.sqlClearTableCanNotPerfomed, message);
    }

    const insertSql = insertHistorySql(tableName, timeStart, timeEnd);
    this.logger.log(`sql: ${insertSql}`);
    this.logger.log(`Ищем в истории строки от даты ${dayjs.utc(timeStart).format(DATE_TIME_FORMAT)} до ${dayjs.utc(timeEnd).format(DATE_TIME_FORMAT)}`);

    try {
      await historyModel.sequelize.query(insertSql);
    } catch (e) {
      const message = `Ошибка при вставке истории в таблицу ${tableName}`
      this.logger.error(message, e);
      throw new HistoryBadStateException(EMPTY_STRING, HistoryErrorCodeEnum.sqlInsertTableCanNotPerfomed, message);
    }
  }

  /**
  * 
  * @param tableNumber 
  */
  private async getUserHistoryInfo(
    baseTableName: string,
    tableNumber: number,
  ): Promise<TimelineStartRecordResponse> {
    const tableName = SettingsService.getRecordTableNameByIndex(TOI_HISTORY_TABLE_NAME, tableNumber);
    const infoSql = `
      SELECT COUNT(*) AS allRecs, MIN(step) AS startId, MAX(step) AS endId
      FROM ${tableName}
      `;

    try {
      await this.toiHistoryModel.sequelize.query(infoSql);
      const [records] = await this.toiHistoryModel.sequelize.query(infoSql) as Array<TimelineStartRecordResponse>;
      return records?.[0];
    } catch (e) {
      const message = `Ошибка при получении информации по вставленным таблицу истории ${tableName} данным`;
      this.logger.error(message, e);
      throw new HistoryBadStateException(EMPTY_STRING, HistoryErrorCodeEnum.sqlSelectTableCanNotPerfomed, message);
    }
  }

  /**
* 
* @param tableNumber 
*/
  public async getTimeByStep(
    tableNumber: number,
    step: number,
  ): Promise<CurrentTimeRecord | null> {
    const tableName = SettingsService.getRecordTableNameByIndex(TOI_HISTORY_TABLE_NAME, tableNumber);
    const infoSql = `SELECT step as currentId, time as currentTime FROM ${tableName} where step = ${step}`;

    try {
      await this.toiHistoryModel.sequelize.query(infoSql);
      const [records] = await this.toiHistoryModel.sequelize.query(infoSql) as Array<CurrentTimeRecord>;

      if (!records || !records?.[0]) {
        return null
      }
      const record = records[0];
      return {
        currentId: record.currentId,
        currentTime: dayjs(record.currentTime).toDate().getTime(),
      }
    } catch (e) {
      const message = `Ошибка при получении информации из таблице ${tableName}`;
      this.logger.error(message, e);
      throw new HistoryBadStateException(EMPTY_STRING, HistoryErrorCodeEnum.sqlSelectTableCanNotPerfomed, message);
    }
  }

  async tryFillInUserHistoryTable(login: string, startTime: Date, endTime: Date, velocity: number): Promise<TimelineRecordDto> {
    // Проверяем, вдруг юзер уже получает историю, а значит - за ним закреплены таблицы
    const inRecordStatus = await this.recordStatusService.isInRecordStatus(login);

    // Пробуем найти и выделить свободную таблицу
    if (!inRecordStatus) {
      // Ищём свободный номер таблицы
      const nextFreeTableNumber = await this.getNextFreeTableNumber();
      if (nextFreeTableNumber > NO_FREE_HISTORY_RECORD_TABLE) {
        try {
          const toiHistoryTableName = SettingsService.getRecordTableNameByIndex(TOI_HISTORY_TABLE_NAME, nextFreeTableNumber);
          await this.prepareUserHistoryTable(toiHistoryTableName, startTime, endTime, this.toiHistoryModel, insertToiHistorySql, deleteSql);
          
          const omnicomHistoryTableName = SettingsService.getRecordTableNameByIndex(OMNICOM_HISTORY_TABLE_NAME, nextFreeTableNumber);
          await this.prepareUserHistoryTable(omnicomHistoryTableName, startTime, endTime, this.omnicomHistoryModel, insertOmnicomHistorySql, deleteSql);

          const meteoHistoryTableName = SettingsService.getRecordTableNameByIndex(METEO_HISTORY_TABLE_NAME, nextFreeTableNumber);
          await this.prepareUserHistoryTable(meteoHistoryTableName, startTime, endTime, this.meteoHistoryModel, insertMeteoHistorySql, deleteSql);


          // Получим номер первого и последнего шагов из сгенерированной ранее таблицы
          const { allRecs: allToiRecs, startId: startToiId, endId: endToiId, } = await this.getUserHistoryInfo(
            TOI_HISTORY_TABLE_NAME, nextFreeTableNumber,
          );
          this.logger.log(`Пользователь ${login}, toi history нашли строк: ${allToiRecs}`);

          const { allRecs: allOmnicomRecs, startId: startOmnicomId, endId: endOmnicomId, } = await this.getUserHistoryInfo(
            OMNICOM_HISTORY_TABLE_NAME, nextFreeTableNumber,
          );
          this.logger.log(`Пользователь ${login}, omnicom history нашли строк: ${allOmnicomRecs}`);


          const { allRecs: allMeteoRecs, startId: startMeteoId, endId: endMeteoId, } = await this.getUserHistoryInfo(
            METEO_HISTORY_TABLE_NAME, nextFreeTableNumber,
          );
          this.logger.log(`Пользователь ${login}, toi history нашли строк: ${allMeteoRecs}`);

          if (allToiRecs === 0) {
            const message = `По заданным датам начала ${startTime} и конца ${endTime} выборки истории вернулось нуль строк. Не смысла переходить в режим воспроизведения записи`;
            this.logger.error(message);
            await this.recordStatusService.resetUserHistoryStatusOnException(login);
            throw new HistoryBadStateException(login, HistoryErrorCodeEnum.emptyHistoryResult, message);
          }

          // Сохраним сеттинги для пользователя, который пытается включить запись: время начала и завершения, текущий шаг и т.д.
          const recordDto = new TimelineRecordDto(
            login, startTime, endTime, startTime,
            startToiId, endToiId, startToiId,
            startOmnicomId, endOmnicomId, startOmnicomId,
            startMeteoId, endMeteoId, startMeteoId,
            velocity, nextFreeTableNumber)
          this.logger.log(`recordDto: ${JSON.stringify(recordDto)}`);
          await this.recordStatusService.setRecordStatus(recordDto);

          this.logger.log(`History info: nextFreeTableNumber: ${nextFreeTableNumber}, startId: ${startToiId}, endId: ${endToiId}`);

          return recordDto;
        } catch (e) {
          if (e instanceof HistoryBadStateException) {
            throw e;
          } else {
            let message = `Ошибка при попытке сформировать таблицу истории с номером ${nextFreeTableNumber} для пользователя ${login}`;
            this.logger.error(message);
            await this.recordStatusService.resetUserHistoryStatusOnException(login);
            throw new HistoryBadStateException(login, HistoryErrorCodeEnum.historyTableIsBusy, 'Неизвестная ошибка');
          }
        }
      }
    } else {
      const message = `Пользователь ${login} находится в статусе воспроизведения истории`;
      this.logger.error(message);
      await this.recordStatusService.resetUserHistoryStatusOnException(login);
      throw new HistoryBadStateException(login, HistoryErrorCodeEnum.userIsAlreadyInRecordStatus, message);
    }
  }
}

export default HistoryUserService;
