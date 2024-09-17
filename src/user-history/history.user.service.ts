import { Injectable, Logger } from "@nestjs/common";
import { CurrentTimeRecord, RecordStatusService, UserHistoryInfoType, TimelineStartRecordResponse } from "./record.status.service";
import { TimelineRecordDto } from "./timeline.record.dto";
import { NO_FREE_HISTORY_RECORD_TABLE, RECORD_SETTING_PROPERTY_NAME } from "../history/consts";
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
import { getModelTableName } from "src/history/types";
import { HistoryTableType } from "src/history/types";
import { getCurrentHistoryInfoSql, getHistoryInfoSql, insertAznbHistorySql, insertStandsHistorySql, insertToiHistorySql } from "./sql";
import { insertOmnicomHistorySql } from "./sql";
import { insertMeteoHistorySql } from "./sql";
import { deleteSql } from "./sql";
import { InsertHistorySqlType } from "./types";
import { OnlyTablenameParamSqlType } from "./types";
import StandsHistory from "src/db/models/standsHistory.model";
import AznbHistory from "src/db/models/aznbHistory.model";

@Injectable()
class HistoryUserService {
  private readonly logger = new Logger(HistoryUserService.name);

  constructor(
    private readonly settingsService: SettingsService,
    private readonly configService: ApiConfigService,
    private readonly recordStatusService: RecordStatusService,
    @InjectModel(ToiHistory) private readonly toiHistoryModel: typeof ToiHistory,
    @InjectModel(OmnicomHistory) private readonly omnicomHistoryModel: typeof OmnicomHistory,
    @InjectModel(MeteoHistory) private readonly meteoHistoryModel: typeof MeteoHistory,
    @InjectModel(StandsHistory) private readonly standsHistoryModel: typeof StandsHistory,
    @InjectModel(AznbHistory) private readonly aznbHistoryModel: typeof AznbHistory
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
    historyModel: HistoryTableType,
    nextFreeTableNumber: number,
    timeStart: Date,
    timeEnd: Date,
    insertHistorySql: InsertHistorySqlType,
    deleteHistorySql: OnlyTablenameParamSqlType
  ): Promise<void> {
    const baseTableName = getModelTableName(historyModel);
    const recordTableName = SettingsService.getRecordTableNameByIndex(baseTableName, nextFreeTableNumber);
    const deleteSql = deleteHistorySql(recordTableName);

    this.logger.log(`historyModel: ${baseTableName}`);
    this.logger.log(`Предварительно очищаем таблицу ${recordTableName} перед вставкой истории, ${deleteSql}`);
    try {
      await historyModel.sequelize.query(deleteSql);
    } catch (e) {
      const message = `Ошибка при очистке таблицы ${recordTableName}`;
      this.logger.error(message, e);
      throw new HistoryBadStateException(EMPTY_STRING, HistoryErrorCodeEnum.sqlClearTableCanNotPerfomed, message);
    }

    const insertSql = insertHistorySql(baseTableName, recordTableName, timeStart, timeEnd);
    this.logger.log(`sql: ${insertSql}`);
    this.logger.log(`Ищем в истории строки от даты ${dayjs.utc(timeStart).format(DATE_TIME_FORMAT)} до ${dayjs.utc(timeEnd).format(DATE_TIME_FORMAT)}`);

    try {
      await historyModel.sequelize.query(insertSql);
    } catch (e) {
      const message = `Ошибка при вставке истории в таблицу ${recordTableName}`
      this.logger.error(message, e);
      throw new HistoryBadStateException(EMPTY_STRING, HistoryErrorCodeEnum.sqlInsertTableCanNotPerfomed, message);
    }
  }

  private async prepareAllUserHistoryTables(
    nextFreeTableNumber: number,
    timeStart: Date,
    timeEnd: Date,
  ): Promise<void> {
    await this.prepareUserHistoryTable(
      this.toiHistoryModel, nextFreeTableNumber, timeStart, timeEnd, insertToiHistorySql, deleteSql
    );
    await this.prepareUserHistoryTable(
      this.omnicomHistoryModel, nextFreeTableNumber, timeStart, timeEnd, insertOmnicomHistorySql, deleteSql
    );
    await this.prepareUserHistoryTable(
      this.meteoHistoryModel, nextFreeTableNumber, timeStart, timeEnd, insertMeteoHistorySql, deleteSql
    );
    await this.prepareUserHistoryTable(
      this.standsHistoryModel, nextFreeTableNumber, timeStart, timeEnd, insertStandsHistorySql, deleteSql
    );
    await this.prepareUserHistoryTable(
      this.aznbHistoryModel, nextFreeTableNumber, timeStart, timeEnd, insertAznbHistorySql, deleteSql
    );
  }

  private async getUserAllHistoriesInfo(
    login: string,
    nextFreeTableNumber: number,
    startTime: Date, endTime: Date
  ): Promise<UserHistoryInfoType> {
    // Получим номер первого и последнего шагов из сгенерированной ранее таблицы
    const toiRecord = await this.getUserHistoryInfo(
      SettingsService.getRecordTableNameByIndex(getModelTableName(this.toiHistoryModel), nextFreeTableNumber)
    );
    this.logger.log(`Пользователь ${login}, toi history нашли строк: ${toiRecord.allRecs}`);

    const omnicomRecord = await this.getUserHistoryInfo(
      SettingsService.getRecordTableNameByIndex(getModelTableName(this.omnicomHistoryModel), nextFreeTableNumber)
    );
    this.logger.log(`Пользователь ${login}, omnicom history нашли строк: ${omnicomRecord.allRecs}`);

    const meteoRecord = await this.getUserHistoryInfo(
      SettingsService.getRecordTableNameByIndex(getModelTableName(this.meteoHistoryModel), nextFreeTableNumber)
    );
    this.logger.log(`Пользователь ${login}, meteo history нашли строк: ${meteoRecord.allRecs}`);

    const standsRecord = await this.getUserHistoryInfo(
      SettingsService.getRecordTableNameByIndex(getModelTableName(this.standsHistoryModel), nextFreeTableNumber)
    );
    this.logger.log(`Пользователь ${login}, meteo history нашли строк: ${meteoRecord.allRecs}`);

    const allHistoriesInfo: UserHistoryInfoType = {
      toiRecord, omnicomRecord, meteoRecord, standsRecord,
    };

    if (allHistoriesInfo.toiRecord.allRecs === 0) {
      const message = `По заданным датам начала ${startTime} и конца ${endTime} выборки истории вернулось нуль строк. Не смысла переходить в режим воспроизведения записи`;
      this.logger.error(message);
      await this.recordStatusService.resetUserHistoryStatusOnException(login);
      throw new HistoryBadStateException(login, HistoryErrorCodeEnum.emptyHistoryResult, message);
    }

    return allHistoriesInfo;
  }

  /**
  * 
  * @param tableNumber 
  */
  private async getUserHistoryInfo(
    tableName: string
  ): Promise<TimelineStartRecordResponse> {
    const infoSql = getHistoryInfoSql(tableName);

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
    tableName: string,
    step: number,
  ): Promise<CurrentTimeRecord | null> {
    const infoSql = getCurrentHistoryInfoSql(tableName, step);

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
        await this.prepareAllUserHistoryTables(nextFreeTableNumber, startTime, endTime);

        try {
          // Получим информацию из сгенерированных таблиц о первом и последнем шагах
          const userAllHistoriesInfo = await this.getUserAllHistoriesInfo(login, nextFreeTableNumber, startTime, endTime);

          // Сохраним сеттинги для пользователя, который пытается включить запись: время начала и завершения, текущий шаг и т.д.
          const recordDto = new TimelineRecordDto({
            login, startTime, endTime, currentTime: startTime,
            velocity, tableNumber: nextFreeTableNumber,
            toiRecord: userAllHistoriesInfo.toiRecord,
            omnicomRecord: userAllHistoriesInfo.omnicomRecord,
            meteoRecord: userAllHistoriesInfo.meteoRecord,
            standsRecord: userAllHistoriesInfo.standsRecord,
          });

          // this.logger.log(`recordDto: ${JSON.stringify(recordDto)}`);
          await this.recordStatusService.setRecordStatus(recordDto);
          this.logger.log(`History info: nextFreeTableNumber: ${nextFreeTableNumber}, startId: ${userAllHistoriesInfo.toiRecord.startId}, endId: ${userAllHistoriesInfo.toiRecord.endId}`);

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
