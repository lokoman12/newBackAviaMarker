import { Injectable, Logger, NotAcceptableException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import ToiHistory, { IToiHistory } from "src/db/models/toiHistory.model";
import { SettingsService } from "src/settings/settings.service";
import { RecordStatusService, } from "../user-history/record.status.service";
import { QueryTypes } from "sequelize";
import { ToiHistoryResponseType } from "./types";
import dayjs from '../utils/dayjs';

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
    private readonly recordStatusService: RecordStatusService,
    @InjectModel(ToiHistory) private readonly toiHistoryModel: typeof ToiHistory
  ) {
    this.logger.log('Сервис инициализирован!')
  }

  async getHistoryFromStartTillEnd(
    timeStart: Date,
    timeEnd: Date
  ): Promise<Array<IToiHistory>> {
    const dbHistoryResult = await this.toiHistoryModel.findAll({
      raw: true,
      where: {
        time: {
          gte: timeStart,
          lt: timeEnd,
        },
      },
    });
    return dbHistoryResult;
  }

  async getCurrentHistory(
    login: string
  ): Promise<ToiHistoryResponseType> {
    // Текущее состояние воспроизведения записи пользователя
    const status = await this.recordStatusService.getRecordStatus(login);
    if (!status) {
      this.logger.error(`Can not get status for user with login ${login}`);
      throw new NotAcceptableException(`Can not get status for user with login ${login}`);
    }

    // Новый текущий шаг
    const nextId = status.currentId + 1;
    // Получим имя таблицы истории для залогиненного пользователя
    const tableName = SettingsService.getRecordHistoryTableNameByIndex(status.tableNumber);

    const getHistorySql = `
      SELECT *
      FROM ${tableName}
      WHERE step = '${nextId}'`;
    // this.logger.log(getHistorySql);

    // Получим значения для первого и последнего шагов сформированной для пользователя истории
    const records = await this.toiHistoryModel.sequelize.query(
      getHistorySql,
      { raw: true, model: ToiHistory, mapToModel: true, type: QueryTypes.SELECT, }
    );

    // Обновим текущие шаг и время
    // this.logger.log(`status.currentId: ${status.currentId}, nextId: ${nextId}, record[0].time: ${records?.[0]?.time || status.currentTime}`);
    const nextCurrent = await this.recordStatusService.setNextCurrentPropertiesRecordStatus(
      login, nextId, records?.[0]?.time || status.currentTime
    );

    return {
      rows: records,
      state: {
        nextCurrentStep: nextCurrent.nextCurrentStep,
        nextCurrentTime: nextCurrent.nextCurrentTime,
      },
    };
  }

}

export default HistoryService;
