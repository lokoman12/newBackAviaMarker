import { Injectable, Logger } from "@nestjs/common";
import { CurrentTimeRecord, RecordStatusService, UserHistoryInfoType, TimelineStartRecordResponse } from "./record.status.service";
import { TimelineRecordDto } from "./timeline.record.dto";
import { NO_FREE_HISTORY_RECORD_TABLE, RECORD_SETTING_PROPERTY_NAME } from "../history/consts";
import ToiHistory from "src/db/models/toiHistory.model";
import { InjectConnection, InjectModel } from "@nestjs/sequelize";
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
import { getCurrentHistoryInfoSql, getHistoryInfoSql, insertAznbHistorySql, insertMeteoHistorySql, insertOmnicomHistorySql, insertStandsHistorySql, insertToiHistorySql } from "./sql";
import { deleteSql } from "./sql";
import { InsertHistorySqlType, convertStringToHistoryGenerateStagesEnumKey } from "./types";
import { OnlyTablenameParamSqlType } from "./types";
import StandsHistory from "src/db/models/standsHistory.model";
import AznbHistory from "src/db/models/aznbHistory.model";
import { Sequelize } from "sequelize";

type AllHistoryModelsWithPrepareSqlType = Array<{
  model: HistoryTableType,
  insertHistorySql: InsertHistorySqlType,
  deleteHistorySql: OnlyTablenameParamSqlType
}>;

@Injectable()
class HistoryUserService {
  private readonly logger = new Logger(HistoryUserService.name);
  private allHistoryModelsWithPrepareSql: AllHistoryModelsWithPrepareSqlType;

  constructor(
    private readonly settingsService: SettingsService,
    private readonly configService: ApiConfigService,
    private readonly recordStatusService: RecordStatusService,
    @InjectConnection()
    private readonly sequelize: Sequelize,
    @InjectModel(ToiHistory) private readonly toiHistoryModel: typeof ToiHistory,
    @InjectModel(OmnicomHistory) private readonly omnicomHistoryModel: typeof OmnicomHistory,
    @InjectModel(MeteoHistory) private readonly meteoHistoryModel: typeof MeteoHistory,
    @InjectModel(StandsHistory) private readonly standsHistoryModel: typeof StandsHistory,
    @InjectModel(AznbHistory) private readonly aznbHistoryModel: typeof AznbHistory
  ) {
    this.logger.log('Сервис инициализирован!');

    this.allHistoryModelsWithPrepareSql = [
      {
        model: this.toiHistoryModel,
        insertHistorySql: insertToiHistorySql,
        deleteHistorySql: deleteSql,
      },
      {
        model: this.omnicomHistoryModel,
        insertHistorySql: insertOmnicomHistorySql,
        deleteHistorySql: deleteSql,
      },
      {
        model: this.meteoHistoryModel,
        insertHistorySql: insertMeteoHistorySql,
        deleteHistorySql: deleteSql,
      },
      {
        model: this.standsHistoryModel,
        insertHistorySql: insertStandsHistorySql,
        deleteHistorySql: deleteSql,
      },
      {
        model: this.aznbHistoryModel,
        insertHistorySql: insertAznbHistorySql,
        deleteHistorySql: deleteSql,
      },
    ];
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
   * Пересоздадим номерную таблицу истории пользователя с заданным индексом tableNumber.
   * Скопируем туда историю от даты timeStart по дату timeEnd. Даты должны иметь корректный формат
   * @param tableNumber 
   * @param timeStart 
   * @param timeEnd 
   */
  private async prepareUserHistoryTable(
    login: string,
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

    this.logger.log(`Предварительно очищаем таблицу ${recordTableName} перед вставкой истории, ${deleteSql}`);
    try {
      await this.sequelize.query(deleteSql);
    } catch (e) {
      const message = `Ошибка при очистке таблицы ${recordTableName}`;
      this.logger.error(message, e);
      throw new HistoryBadStateException(EMPTY_STRING, HistoryErrorCodeEnum.sqlClearTableCanNotPerfomed, message);
    }

    const insertSql = insertHistorySql(baseTableName, recordTableName, timeStart, timeEnd);
    this.logger.log(`sql: ${insertSql}`);
    this.logger.log(`Ищем в истории строки от даты ${dayjs.utc(timeStart).format(DATE_TIME_FORMAT)} до ${dayjs.utc(timeEnd).format(DATE_TIME_FORMAT)}`);

    try {
      await this.sequelize.query(insertSql);
    } catch (e) {
      const message = `Ошибка при вставке истории в таблицу ${recordTableName}`
      this.logger.error(message, e);
      throw new HistoryBadStateException(EMPTY_STRING, HistoryErrorCodeEnum.sqlInsertTableCanNotPerfomed, message);
    }

    try {
      await this.saveStage(login, historyModel);
    } catch (e) {
      const message = `Ошибка при сохранении шага истории ${recordTableName} в базу`;
      this.logger.error(message, e);
      throw new HistoryBadStateException(EMPTY_STRING, HistoryErrorCodeEnum.canNotSaveHistoryStage, message);
    }
  }

  private async saveStage(login: string, historyModel: HistoryTableType, result?: boolean) {
    // Мапим конкретное значение HistoryGenerateStagesEnum на обязательный атрибут модели tableName
    const tableName = getModelTableName(historyModel);
    const stage = convertStringToHistoryGenerateStagesEnumKey(tableName);
    let status = await this.recordStatusService.getRecordStatus(login);
    status.addHistoryGenerationStage(stage, result);
    await this.recordStatusService.setRecordStatus(status);
  }

  /**
  * Сгенерировать и заполнить все номерные таблицы истории пользователя
  */
  private async prepareAllUserHistoryTables(
    login: string,
    nextFreeTableNumber: number,
    timeStart: Date,
    timeEnd: Date,
  ): Promise<void> {
    await Promise.all(this.allHistoryModelsWithPrepareSql.map(async (it) => {
      let stageResult = false;
      try {
        await this.prepareUserHistoryTable(
          login, it.model, nextFreeTableNumber, timeStart, timeEnd, it.insertHistorySql, it.deleteHistorySql
        );
        stageResult = true;
      } catch (e) {
        stageResult = false;
      }
      try {
        await this.saveStage(login, it.model, stageResult);
      } catch (e) {
        const tableName = getModelTableName(it.model);
        this.logger.error(`Ошибка сохранения состояния этапа для таблицы ${tableName}`)
      }
    }));
  }

  /**
  * Вернуть количество строк, первый и последний шаги из номерной таблицы истории пользователя
  * @param tableNumber 
  */
  private async getUserHistoryInfo(
    tableName: string
  ): Promise<TimelineStartRecordResponse> {
    const infoSql = getHistoryInfoSql(tableName);

    try {
      // await this.this.sequelize.query(infoSql);
      const [records] = await this.sequelize.query(infoSql) as Array<TimelineStartRecordResponse>;
      return records?.[0];
    } catch (e) {
      const message = `Ошибка при получении информации по вставленным таблицу истории ${tableName} данным`;
      this.logger.error(message, e);
      throw new HistoryBadStateException(EMPTY_STRING, HistoryErrorCodeEnum.sqlSelectTableCanNotPerfomed, message);
    }
  }

  /**
  * Вернуть количество строк, первый и последний шаги по всем номерным таблицам истории пользователя
  * @param tableNumber 
  */
  private async getUserAllHistoriesInfo(
    login: string,
    nextFreeTableNumber: number,
    startTime: Date, endTime: Date
  ): Promise<UserHistoryInfoType> {
    const promises: Array<Promise<TimelineStartRecordResponse>> = [];

    // Получим номер первого и последнего шагов из сгенерированной ранее таблицы
    this.allHistoryModelsWithPrepareSql.forEach(it => {
      const baseHistoryTableName = getModelTableName(it.model);
      const userHistoryTableName = SettingsService.getRecordTableNameByIndex(
        getModelTableName(it.model), nextFreeTableNumber
      );
      const info = this.getUserHistoryInfo(userHistoryTableName).then(it => {
        this.logger.log(`Пользователь ${login}, ${baseHistoryTableName} нашли строк: ${it.allRecs}`);
        return it;
      });
      promises.push(info);
    });

    const allInfoArray = await Promise.all(promises);
    const allHistoriesInfoResult: UserHistoryInfoType = {
      toiRecord: allInfoArray[0], omnicomRecord: allInfoArray[1], meteoRecord: allInfoArray[2], standsRecord: allInfoArray[3], aznbRecord: allInfoArray[4],
    };

    if (allHistoriesInfoResult.toiRecord.allRecs === 0) {
      const message = `По заданным датам начала ${startTime} и конца ${endTime} выборки истории вернулось нуль строк. Не смысла переходить в режим воспроизведения записи`;
      this.logger.error(message);
      await this.recordStatusService.resetUserHistoryStatusOnException(login);
      throw new HistoryBadStateException(login, HistoryErrorCodeEnum.emptyHistoryResult, message);
    }

    return allHistoriesInfoResult;
  }

  /**
  * Вернуть время из номерной таблицы истории по шагу
  * @param tableNumber 
  */
  public async getTimeByStep(
    tableName: string,
    step: number,
  ): Promise<CurrentTimeRecord | null> {
    const infoSql = getCurrentHistoryInfoSql(tableName, step);

    try {
      await this.sequelize.query(infoSql);
      const [records] = await this.sequelize.query(infoSql) as Array<CurrentTimeRecord>;

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
        await this.recordStatusService.setRecordStatus(new TimelineRecordDto({
          login, startTime, endTime, currentTime: startTime,
          velocity, tableNumber: nextFreeTableNumber,
          historyGenerateStages: {},
        }));

        await this.prepareAllUserHistoryTables(login, nextFreeTableNumber, startTime, endTime);

        try {
          // Получим информацию из сгенерированных таблиц о первом и последнем шагах
          const userAllHistoriesInfo = await this.getUserAllHistoriesInfo(login, nextFreeTableNumber, startTime, endTime);
          // Сохраним сеттинги для пользователя, который пытается включить запись: время начала и завершения, текущий шаг и т.д.
          const recordDto = await this.recordStatusService.getRecordStatus(login);
          await this.recordStatusService.setRecordStatus(recordDto.setHistoriesInfo(userAllHistoriesInfo));
          return recordDto;
        } catch (e) {
          if (e instanceof HistoryBadStateException) {
            throw e;
          } else {
            let message = `Ошибка при попытке сформировать таблицу истории с номером ${nextFreeTableNumber} для пользователя ${login}`;
            this.logger.error(message);
            await this.recordStatusService.resetUserHistoryStatusOnException(login);
            throw new HistoryBadStateException(login, HistoryErrorCodeEnum.unknownHistoryError, 'Неизвестная ошибка');
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
