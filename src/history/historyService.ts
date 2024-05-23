import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { ApiConfigService } from "src/config/api.config.service";
import ToiHistory, { IToiHistoryClient } from "src/db/models/toiHistory.model";
import { flatOffsetMeterToLongitudeLatitude } from "src/utils/XYtoLanLon";
import { omit } from 'lodash';
import { SettingsService } from "src/settings/settings.service";
import dayjs from "../utils/dayjs";
import { DATE_TIME_FORMAT } from "src/auth/consts";
import { NO_FREE_HISTORY_RECORD_TABLE, RECORD_SETTING_PROPERTY_NAME, SQL_DATE_TIME_FORMAT } from "./consts";
import { difference, head } from 'lodash';

export interface IHistoryClient {
  id: number;
  idFormular: number;
  coordination: Array<number>;
  H: number;
  callsign: string;
  status: number;
  time: string;
}

@Injectable()
class HistoryService {
  private readonly logger = new Logger(HistoryService.name);

  constructor(
    private readonly settingsService: SettingsService,
    private readonly configService: ApiConfigService,
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

  async getHistory(
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

    const insertSql = `
  INSERT into ${tableName} (
    id, Number, time, X, Y, H,
    CRS, id_Sintez, Name, faza,
    Source_ID,  Type_of_Msg, Speed, FP_Callsign,
    tobtg, FP_TypeAirCraft, tow,
    FP_Stand, airport_code, taxi_out, ata, regnum
  )
    SELECT 
      id, Number, time, X, Y, H,
      CRS, id_Sintez, Name, faza,
      Source_ID,  Type_of_Msg, Speed, FP_Callsign,
      tobtg, FP_TypeAirCraft, tow,
      FP_Stand, airport_code, taxi_out, ata, regnum FROM toi_history
    WHERE Name != "" AND Number != 0 
      AND time <= STR_TO_DATE('${dayjs.utc(timeEnd).format(DATE_TIME_FORMAT)}', '${SQL_DATE_TIME_FORMAT}') 
      AND time >= STR_TO_DATE('${dayjs.utc(timeStart).format(DATE_TIME_FORMAT)}', '${SQL_DATE_TIME_FORMAT}');`;
    this.logger.log(`Ищем в истории строки от даты ${dayjs.utc(timeStart).format(DATE_TIME_FORMAT)} до ${dayjs.utc(timeEnd).format(DATE_TIME_FORMAT)}`);
    this.logger.log(`sql: ${insertSql}`);

    try {
      const [records] = await this.toiHistoryModel.sequelize.query(insertSql);
      this.logger.log(`History record rowCount ${records.length}`);
    } catch (e) {
      this.logger.error(`Ошибка при вставке истории в таблицу ${tableName}`, e);
      throw new Error(e);
    }
  }
}

export default HistoryService;
