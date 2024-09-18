import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { SettingsService } from "src/settings/settings.service";
import { RecordStatusService, } from "../user-history/record.status.service";
import { QueryTypes } from "sequelize";
import { HistoryErrorCodeEnum, HistoryBadStateException } from "src/user-history/user.bad.status.exception";
import { isNormalNumber } from "src/utils/number";
import { OMNICOM_HISTORY_TABLE_NAME, TOI_HISTORY_TABLE_NAME } from "./consts";
import OmnicomHistory from "src/db/models/scoutHistory.model";
import { HistoryResponseType, getModelTableName } from "./types";

@Injectable()
class OmnicomHistoryService {
  private readonly logger = new Logger(OmnicomHistoryService.name);

  constructor(
    private readonly recordStatusService: RecordStatusService,
    @InjectModel(OmnicomHistory) private readonly historyModel: typeof OmnicomHistory
  ) {
    this.logger.log('Сервис инициализирован!')
  }

  async getHistoryFromStartTillEnd(
    timeStart: Date,
    timeEnd: Date
  ): Promise<Array<OmnicomHistory>> {
    const dbHistoryResult = await this.historyModel.findAll({
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
  ): Promise<HistoryResponseType> {
    // Текущее состояние воспроизведения записи пользователя
    const status = await this.recordStatusService.getRecordStatus(login);
    if (!status) {
      const message = `При попытке получить историю для пользователя ${login} нет сохранённого статуса`;
      this.logger.error(message);
      throw new HistoryBadStateException(login, HistoryErrorCodeEnum.userStatusNotFound, message);
    }

    // Новый текущий шаг
    // const nextId = status.currentOmnicomId + 1;
    const nextId = status.currentOmnicomId;
    // Получим имя таблицы истории для залогиненного пользователя
    const baseTableName = getModelTableName(this.historyModel);
    const tableName = SettingsService.getRecordTableNameByIndex(baseTableName, status.tableNumber);

    const getHistorySql = `
      SELECT *
      FROM ${tableName}
      WHERE step = '${nextId}'`;
    // this.logger.log(getHistorySql);

    // Получим значения для первого и последнего шагов сформированной для пользователя истории
    const records = await this.historyModel.sequelize.query(
      getHistorySql,
      { raw: true, model: OmnicomHistory, mapToModel: true, type: QueryTypes.SELECT, }
    );

    // Обновим текущие шаг и время
    // this.logger.log(`status.currentToiId: ${status.currentToiId}, nextId: ${nextId}, record[0].time: ${records?.[0]?.time || status.currentTime}`);
    // const nextCurrent = await this.recordStatusService.setNextCurrentPropertiesRecordStatus(
    //   login, nextId, records?.[0]?.time || status.currentTime
    // );
    
    // const nextCurrentStep = nextCurrent.nextCurrentStep;
    // const nextCurrentTime = nextCurrent.nextCurrentTime;
    const nextCurrentStep = status.currentOmnicomId;
    const nextCurrentTime = status.currentTime.getTime();

    // this.logger.log(`isNumber(value) && !isNaN(value) && isFinite(value) = ${isNumber(nextCurrentTime)} && ${!isNaN(nextCurrentTime)} && ${isFinite(nextCurrentTime)}`);
    if (!isNormalNumber(nextCurrentStep)) {
      const message = `Ошибка при попытке получить следующий шаг '${nextCurrentStep}' воспроизведения истории для пользователя '${login}'`;
      this.logger.error(message);
      throw new HistoryBadStateException(login, HistoryErrorCodeEnum.invalidStepValue, message);
    }

    return {
      rows: records,
      state: {
        nextCurrentStep,
        nextCurrentTime,
      },
    };
  }

}

export default OmnicomHistoryService;
