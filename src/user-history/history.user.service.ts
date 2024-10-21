import { Injectable, Logger } from "@nestjs/common";
import { RecordStatusService } from "./record.status.service";
import { TimelineRecordUserAllInfoType, TimelineStartRecordResponse, capitalizeFirstLetter, getInitUserAllInfo } from "./types";
import { CurrentTimeRecord } from "./types";
import { TimelineRecordDto } from "./timeline.record.dto";
import { NO_FREE_HISTORY_RECORD_TABLE, RECORD_SETTING_PROPERTY_NAME, RECORD_TABLENUMBER_SETTING_PROPERTY_NAME } from "../history/consts";
import ToiHistory from "src/db/models/toiHistory.model";
import { InjectConnection, InjectModel } from "@nestjs/sequelize";
import { SettingsService } from "src/settings/settings.service";
import { ApiConfigService } from "src/config/api.config.service";
import { difference, head, isNumber, mapKeys, mapValues, chain, entries, fromPairs, } from "lodash";
import { DATE_TIME_FORMAT, EMPTY_STRING } from "src/auth/consts";
import dayjs from "../utils/dayjs";
import { HistoryErrorCodeEnum, HistoryBadStateException } from "./user.bad.status.exception";
import OmnicomHistory from "src/db/models/scoutHistory.model";
import MeteoHistory from "src/db/models/meteoHistory.model";
import { getModelTableName } from "src/history/types";
import { HistoryTableType } from "src/history/types";
import { getCurrentHistoryInfoSql, getHistoryInfoSql, insertAznbHistorySql, insertMeteoHistorySql, insertOmnicomHistorySql, insertStandsHistorySql, insertToiHistorySql } from "./sql";
import { deleteSql } from "./sql";
import { HistoryGenerateStagesEnum, HistoryGenerateStagesType, InsertHistorySqlType, convertStringToHistoryGenerateStagesEnumKey } from "./types";
import { OnlyTablenameParamSqlType } from "./types";
import StandsHistory from "src/db/models/standsHistory.model";
import AznbHistory from "src/db/models/aznbHistory.model";
import { Sequelize, Transaction } from "sequelize";
import Settings from "src/db/models/settings";
import { isObject } from 'lodash';
import { nonNull } from "src/utils/common";

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
    @InjectModel(Settings) private readonly settingsModel: typeof Settings,
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

  async getNextFreeTableNumberNew() {
    let usedTableNumbers = await this.settingsService
      .getAllSettingsByName(RECORD_TABLENUMBER_SETTING_PROPERTY_NAME);
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
    // this.logger.log(`sql: ${insertSql}`);
    this.logger.log(`Ищем в истории строки от даты ${dayjs.utc(timeStart).format(DATE_TIME_FORMAT)} до ${dayjs.utc(timeEnd).format(DATE_TIME_FORMAT)}`);

    try {
      await this.sequelize.query(insertSql);
    } catch (e) {
      const message = `Ошибка при вставке истории в таблицу ${recordTableName}`
      this.logger.error(message, e);
      throw new HistoryBadStateException(EMPTY_STRING, HistoryErrorCodeEnum.sqlInsertTableCanNotPerfomed, message);
    }

    try {
      this.logger.log('save prepareUserHistoryTable');
      await this.saveStageByHistoryNameWithTx(login, baseTableName, HistoryErrorCodeEnum.continueCheck);
    } catch (e) {
      const message = `Ошибка при сохранении шага истории ${recordTableName} в базу`;
      this.logger.error(message, e);
      throw new HistoryBadStateException(EMPTY_STRING, HistoryErrorCodeEnum.canNotSaveHistoryStage, message);
    }
  }

  /**
   * Сохраняет статус генерации номерной таблицы истории в сеттингах в виде JSON-string в поле value
   * @param login 
   * @param tableName имя базовой таблицы истории, из которой забираются строки в номерные таблицы
   * @param result статус шага генерации номерной таблицы истории
   */
  private async saveStageByHistoryNameWithTx(login: string, tableName: string, result: HistoryErrorCodeEnum, stageStat?: Partial<TimelineRecordUserAllInfoType>) {
    const stage = convertStringToHistoryGenerateStagesEnumKey(tableName);

    try {
      // Открываем транзакцию и лочим запись из таблицы Settings, так как пишем в таблицу асинхронно
      await this.sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED }, async tx => {
        // Перед заптсью нового значения, читаем строку с сеттингами и блокируем её на запись, чтобы не было lost updates
        const recordSetting = await this.settingsModel.findOne({
          where: {
            name: RECORD_SETTING_PROPERTY_NAME, username: login,
          },
          lock: {
            level: tx.LOCK.UPDATE,
            of: Settings
          },
          transaction: tx,
        });
        if (recordSetting) {
          let value = TimelineRecordDto.fromJsonString(recordSetting.getDataValue('value'));
          const historyGenerateStages = value.historyGenerateStages;
          historyGenerateStages[stage] = result;

          this.logger.log(`value: ${JSON.stringify(value)}, stageStat: ${JSON.stringify(stageStat)}`);
          if (nonNull(stageStat) && isObject(stageStat)) {
            Object.assign(value, stageStat);
            this.logger.log(`New value: ${JSON.stringify(value)}`);
          }

          await recordSetting.update({
            value: value.asJsonString(),
          }, { transaction: tx, });
       }
      });
    } catch (err) {
      this.logger.log(`Сохранить новый статус для истории ${stage} не получилось, ошибка: ${err}`);
    }
  }

  private async saveStageByHistoryModelWithTx(login: string, historyModel: HistoryTableType, result: HistoryErrorCodeEnum, stageStat?: Partial<TimelineRecordUserAllInfoType>) {
    // Мапим конкретное значение HistoryGenerateStagesEnum на обязательный атрибут модели tableName
    const tableName = getModelTableName(historyModel);
    await this.saveStageByHistoryNameWithTx(login, tableName, result, stageStat);
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
    // Ждём, когда все норемные таблицы истории сгенерируются и заполнятся значениями, затем сохраняем обновлённый статус
    await Promise.allSettled(
      this.allHistoryModelsWithPrepareSql.map(async (it) => {
        let stageResult = HistoryErrorCodeEnum.unknownHistoryError;
        try {
          await this.prepareUserHistoryTable(
            login, it.model, nextFreeTableNumber, timeStart, timeEnd, it.insertHistorySql, it.deleteHistorySql
          );
          stageResult = HistoryErrorCodeEnum.continueCheck;
        } catch (e) {
          if (e instanceof HistoryBadStateException) {
            stageResult = (e as HistoryBadStateException).errorCode;
          }
        }
        try {
          this.logger.log('save prepareAllUserHistoryTables');
          await this.saveStageByHistoryModelWithTx(login, it.model, stageResult);
        } catch (e) {
          const tableName = getModelTableName(it.model);
          this.logger.error(`Ошибка сохранения состояния этапа для таблицы ${tableName}`)
        }
      }));
  }

  /**
  * Вернуть количество строк, первый и saveStageByHistoryModelпоследний шаги из номерной таблицы истории пользователя
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
  ): Promise<void> {
    const userAllInfo = getInitUserAllInfo();
    const userAllInfoAfterSet = getInitUserAllInfo();
    let userInfo: Partial<TimelineRecordUserAllInfoType>;

    await Promise.allSettled(
      this.allHistoryModelsWithPrepareSql.map(async it => {
        const historyTableName = getModelTableName(it.model);
        const userHistoryTableName = SettingsService.getRecordTableNameByIndex(
          getModelTableName(it.model), nextFreeTableNumber
        );
        this.logger.log(`Пишем шаг базовая таблица ${historyTableName}, таблица пользователя ${userHistoryTableName}`);

        try {
          const info = await this.getUserHistoryInfo(userHistoryTableName);
          this.logger.log(`Пользователь ${login}, ${historyTableName} нашли строк: ${info.allRecs}`);

          const stage = convertStringToHistoryGenerateStagesEnumKey(historyTableName);
          userAllInfo[`${stage}Record`] = info;
          userInfo = {
            [`end${capitalizeFirstLetter(stage)}Id`]: info.endId,
          };
          if (historyTableName === HistoryGenerateStagesEnum.toi) {
            userInfo = {
              ...userInfo,
              [`start${capitalizeFirstLetter(stage)}Id`]: info.startId,
              [`current${capitalizeFirstLetter(stage)}Id`]: info.startId,
            }
          }
          // this.logger.log(`${stage}, userInfo: ${JSON.stringify(userInfo)}`);

          if (info.allRecs === 0) {
            const message = `По заданным датам начала ${startTime} и конца ${endTime} выборки истории вернулось нуль строк. Не смысла переходить в режим воспроизведения записи`;
            this.logger.error(message);

            await this.saveStageByHistoryNameWithTx(login, historyTableName, HistoryErrorCodeEnum.emptyHistoryResult, userInfo).catch(e => {
              const message = `Ошибка при сохранении шага истории в базу для таблицы ${historyTableName}`;
              this.logger.error(message, e);
            });
          } else {
            await this.saveStageByHistoryNameWithTx(login, historyTableName, HistoryErrorCodeEnum.noErrors, userInfo).catch(e => {
              const message = `Ошибка сохранения информации по шагу истории в базу для таблицы ${historyTableName}`;
              this.logger.error(message, e);
            });
          }

          // const stage = convertStringToHistoryGenerateStagesEnumKey(historyTableName);
          // userAllInfo[`${stage}Record`] = info;
          // userInfo = {
          //   [`end${capitalizeFirstLetter(stage)}Id`]: info.endId,
          // };
          // if (historyTableName === HistoryGenerateStagesEnum.toi) {
          //   userInfo = {
          //     ...userInfo,
          //     [`start${capitalizeFirstLetter(stage)}Id`]: info.startId,
          //     [`current${capitalizeFirstLetter(stage)}Id`]: info.startId,
          //   }
          // }
          // this.logger.log(`${stage}, userInfo: ${JSON.stringify(userInfo)}`);
          // await this.saveUserInfoByHistoryNameWithTx(login, historyTableName, userInfo).catch(e => {
          //   const message = `Ошибка сохранения статистики по шагу истории в базу для таблицы ${historyTableName}`;
          //   this.logger.error(message, e);
          // });
        } catch (e) {
          const message = `Ошибка при сохранении шага истории в базу для таблицы ${historyTableName}`;
          // await this.saveStageByHistoryNameWithTx(login, historyTableName, HistoryErrorCodeEnum.canNotSaveHistoryStage).catch(e => {
            // const message = `Ошибка при сохранении шага истории в базу для таблицы ${historyTableName}`;
            // this.logger.error(message, e);
          // });
        }
      })).then(() => {
        this.logger.log(`userAllInfo: ${JSON.stringify(userAllInfo)}`);
      });
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

  async tryFillInUserHistoryTable(login: string, tablenumber: number, startTime: Date, endTime: Date, velocity: number): Promise<void> {
    // Проверяем, вдруг юзер уже получает историю, а значит - за ним закреплены таблицы
    const inRecordStatus = await this.recordStatusService.isInRecordStatus(login);
    // Пробуем найти и выделить свободную таблицу
    if (!inRecordStatus) {
      // Ищём свободный номер таблицы
      const nextFreeTableNumber = tablenumber;
      // const nextFreeTableNumber = await this.getNextFreeTableNumber();
      // if (nextFreeTableNumber > NO_FREE_HISTORY_RECORD_TABLE) {
        await this.recordStatusService.setRecordStatus(new TimelineRecordDto({
          login, startTime, endTime, currentTime: startTime,
          velocity, tableNumber: nextFreeTableNumber,
          historyGenerateStages: {},
        }));

        await this.prepareAllUserHistoryTables(login, nextFreeTableNumber, startTime, endTime);

        // try {
        // Получим информацию из сгенерированных таблиц о первом и последнем шагах
        await this.getUserAllHistoriesInfo(login, nextFreeTableNumber, startTime, endTime);
        // Сохраним сеттинги для пользователя, который пытается включить запись: время начала и завершения, текущий шаг и т.д.
        // const recordDto = await this.recordStatusService.getRecordStatus(login);
        // await this.recordStatusService.setRecordStatus(recordDto.setHistoriesInfo(userAllHistoriesInfo));
        // return recordDto;
        // } catch (e) {
        // if (e instanceof HistoryBadStateException) {
        // throw e;
        // } else {
        // let message = `Ошибка при попытке сформировать таблицу истории с номером ${nextFreeTableNumber} для пользователя ${login}`;
        // this.logger.error(message);
        // Todo, NGolosin - пусть решает пользователь. На фронте есть специальная кнопка сброса состояния воспроизведения
        // await this.recordStatusService.resetUserHistoryStatusOnException(login);
        // throw new HistoryBadStateException(login, HistoryErrorCodeEnum.unknownHistoryError, 'Неизвестная ошибка');
        // }
        // }
      }
    // } else {
    //   const message = `Пользователь ${login} находится в статусе воспроизведения истории`;
    //   this.logger.error(message);
    //   // Todo, NGolosin - пусть решает пользователь. На фронте есть специальная кнопка сброса состояния воспроизведения
    //   // await this.recordStatusService.resetUserHistoryStatusOnException(login);
    //   throw new HistoryBadStateException(login, HistoryErrorCodeEnum.userIsAlreadyInRecordStatus, message);
    // }
  }
}

export default HistoryUserService;


