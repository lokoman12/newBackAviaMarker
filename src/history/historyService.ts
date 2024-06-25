import { Injectable, Logger, NotAcceptableException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { ApiConfigService } from "src/config/api.config.service";
import ToiHistory, { IToiHistoryClient } from "src/db/models/toiHistory.model";
import { flatOffsetMeterToLongitudeLatitude } from "src/utils/XYtoLanLon";
import { omit } from 'lodash';
import { SettingsService } from "src/settings/settings.service";
import dayjs from "../utils/dayjs";
import { DATE_TIME_FORMAT } from "src/auth/consts";
import { NO_FREE_HISTORY_RECORD_TABLE, RECORD_SETTING_PROPERTY_NAME } from "./consts";
import { difference, head } from 'lodash';
import { ActualClientToi } from "src/toi/toi.service";
import { RecordStatusService, TimelineStartRecordResponse } from "./record.status.service";

export interface IHistoryClient {
  id: number;
  idFormular: number;
  coordination: Array<number>;
  H: number;
  callsign: string;
  status: number;
  time: string;
}

// type HistoryInfoType {

// }

@Injectable()
class HistoryService {
  private readonly logger = new Logger(HistoryService.name);

  constructor(
    private readonly settingsService: SettingsService,
    private readonly configService: ApiConfigService,
    private readonly recordStatusService: RecordStatusService,
    @InjectModel(ToiHistory) private readonly toiHistoryModel: typeof ToiHistory
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

  async getHistoryFromStartTillEnd(
    timeStart: Date,
    timeEnd: Date
  ): Promise<Array<IToiHistoryClient>> {
    const dbHistoryResult = await this.toiHistoryModel.findAll({
      raw: true,
      where: {
        time: {
          gte: timeStart,
          lt: timeEnd,
        },
      },
    });

    const activeAirportPosition = this.configService.getActiveAirportPosition();
    const result = dbHistoryResult.map((it) => {
      return Object.assign(omit(it, ['X', 'Y', 'H']), {
        coordination: flatOffsetMeterToLongitudeLatitude(
          activeAirportPosition, it.Y, it.X
        ),
      });
    }) as Array<IToiHistoryClient>;
    return result;
  }

  async getCurrentHistory(
    login: string
  ): Promise<Array<ActualClientToi>> {
    const status = await this.recordStatusService.getRecordStatus(login);
    if (!status) {
      throw new NotAcceptableException(`Can not get status for user with login ${login}`);
    }
    const nextId = status.currentId + 1;
    // const currentStep: number,
    // const currentDate: Date

    return [];
  }

  /**
   * Скопируем в свободную таблицу с заданным индексом tableNumber историю
   * от даты timeStart по дату timeEnd. Таблица должна уже существовать. Даты
   * должны иметь корректный формат
   * @param tableNumber 
   * @param timeStart 
   * @param timeEnd 
   */
  async prepareHistoryForRecordTable(
    tableNumber: number,
    timeStart: Date,
    timeEnd: Date
  ): Promise<void> {
    const tableName = SettingsService.getRecordHistoryTableNameByIndex(tableNumber);

    const deleteSql = `TRUNCATE ${tableName};`;
    this.logger.log(`Предварительно очищаем таблицу ${tableName} перед вставкой истории, ${deleteSql}`);
    try {
      await this.toiHistoryModel.sequelize.query(deleteSql);
    } catch (e) {
      this.logger.error(`Ошибка при очистке таблицы ${tableName}`, e);
      throw new Error(e);
    }

    // В нашем mysql почему-то не работают оконные (over partition) функции
    // Потому, чтобы нумеровать строки с одинаковым временем, использую
    // @id := if(...)
    // Внешний select под insert'ом отбрасывает лишнюю колонку prevTime,
    // нужную только для нумерования строк по группам одинакового времени
    const insertSql = `
  INSERT INTO ${tableName} (
    step, time, Number, X, Y, H,
    CRS, id_Sintez, Name, faza,
    Source_ID,  Type_of_Msg, Speed, FP_Callsign,
    tobtg, FP_TypeAirCraft, tow,
    FP_Stand, airport_code, taxi_out, ata, regnum
  )
  SELECT 	
  step, time,
  Number, X, Y, H,
  CRS, id_Sintez, Name, faza,
  Source_ID,  Type_of_Msg, Speed, FP_Callsign,
  tobtg, FP_TypeAirCraft, tow,
  FP_Stand, airport_code, taxi_out, ata, regnum
FROM (
  SELECT 
    @id := if(@prev_time = time, @id, @id + 1) AS step,
    @prev_time := time AS prevTime, time,
    Number, X, Y, H,
    CRS, id_Sintez, Name, faza,
    Source_ID,  Type_of_Msg, Speed, FP_Callsign,
    tobtg, FP_TypeAirCraft, tow,
    FP_Stand, airport_code, taxi_out, ata, regnum
  FROM toi_history
  , (select @id := 0, @prev_time := null) AS t
  WHERE Name != '' AND Number != 0 
    AND time <= '${dayjs.utc(timeEnd).format(DATE_TIME_FORMAT)}'
    AND time >= '${dayjs.utc(timeStart).format(DATE_TIME_FORMAT)}'
  ORDER BY time
) history_record`;
    this.logger.log(`sql: ${insertSql}`);
    this.logger.log(`Ищем в истории строки от даты ${dayjs.utc(timeStart).format(DATE_TIME_FORMAT)} до ${dayjs.utc(timeEnd).format(DATE_TIME_FORMAT)}`);

    try {
      await this.toiHistoryModel.sequelize.query(insertSql);
    } catch (e) {
      this.logger.error(`Ошибка при вставке истории в таблицу ${tableName}`, e);
      throw new Error(e);
    }
  }

  /**
 * 
 * @param tableNumber 
 * @param timeStart 
 * @param timeEnd 
 */
  async getRecordStatusInfo(
    tableNumber: number,
  ): Promise<TimelineStartRecordResponse> {
    const tableName = SettingsService.getRecordHistoryTableNameByIndex(tableNumber);
    const infoSql = `
    SELECT COUNT(*) AS allRecs, MIN(step) AS startId, MAX(step) AS endId
    FROM ${tableName}
    `;

    try {
      await this.toiHistoryModel.sequelize.query(infoSql);
      const [records] = await this.toiHistoryModel.sequelize.query(infoSql) as Array<TimelineStartRecordResponse>;
      return records?.[0];
    } catch (e) {
      this.logger.error(`Ошибка при вставке истории в таблицу ${tableName}`, e);
      throw new Error(e);
    }
  }
}

export default HistoryService;
