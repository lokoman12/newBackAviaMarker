import { Inject, Logger } from "@nestjs/common";
import { SettingsService } from "src/settings/settings.service";
import { RecordStatusService, } from "../user-history/record.status.service";
import { QueryTypes, Sequelize } from "sequelize";
import { HistoryErrorCodeEnum, HistoryBadStateException } from "src/user-history/user.bad.status.exception";
import { isNormalNumber } from "src/utils/number";
import { HistoryList, HistoryResponseType, getModelTableName } from "./types";
import { getHistorySql } from "src/user-history/sql";
import { HistoryModel } from './types';
import { ModelType } from "./types";
import { InjectConnection } from "@nestjs/sequelize";
import { TimelineRecordDto } from "src/user-history/timeline.record.dto";
import { NextCurrentTypeForResponse } from "src/user-history/types";

abstract class HistoryService<T extends HistoryModel<T>> {
  protected readonly logger = new Logger(HistoryService.name);

  @Inject()
  protected readonly recordStatusService: RecordStatusService;

  constructor(
    protected readonly sequelize: Sequelize,
    protected historyModel: ModelType<T>,
  ) {
    this.logger.log('Сервис инициализирован!')
  }

  async getHistoryFromStartTillEnd(
    timeStart: Date,
    timeEnd: Date
  ): Promise<Array<T>> {
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


  getNextId(currentId: number): number {
    return currentId;
  }

  assertNextStepValue(login: string, stepId: number) {
    if (!isNormalNumber(stepId)) {
      const message = `Ошибка при попытке получить следующий шаг '${stepId}' воспроизведения истории для пользователя '${login}'`;
      this.logger.error(message);
      throw new HistoryBadStateException(login, HistoryErrorCodeEnum.invalidStepValue, message);
    }
  }

  assertCurrentRecordStatus(login: string, status: TimelineRecordDto) {
    if (!status) {
      const message = `При попытке получить историю для пользователя ${login} нет сохранённого статуса`;
      this.logger.error(message);
      throw new HistoryBadStateException(login, HistoryErrorCodeEnum.userStatusNotFound, message);
    }
  }

  async updateStateIfRequiredAndGetNextState(login: string, nextId: number, status: TimelineRecordDto): Promise<NextCurrentTypeForResponse> {
    const nextCurrentStep = status.currentToiId;
    const nextCurrentTime = status.currentTime.getTime();
    this.assertNextStepValue(login, nextCurrentStep);

    return {
      nextCurrentStep,
      nextCurrentTime,
    };
  }

  async getCurrentHistory(
    login: string
  ): Promise<HistoryResponseType> {
    // Текущее состояние воспроизведения записи пользователя
    const status = await this.recordStatusService.getRecordStatus(login);
    this.assertCurrentRecordStatus(login, status);

    // Новый текущий шаг
    const nextId = this.getNextId(status.currentToiId);
    // Записи из истории для текущего или нового шага
    const records = await this.getHistoryRecords(nextId, status);
    // Состояние для следующего шага
    const nextState = await this.updateStateIfRequiredAndGetNextState(login, nextId, status);

    return {
      rows: records as HistoryList,
      state: { ...nextState, },
    };
  }

  protected async getHistoryRecords(nextId: number, status: TimelineRecordDto): Promise<HistoryList> {
    // Получим имя таблицы истории для залогиненного пользователя
    const baseTableName = getModelTableName(this.historyModel);
    // this.logger.log(`baseTableName: ${baseTableName}`);
    const tableName = SettingsService.getRecordTableNameByIndex(baseTableName, status.tableNumber);
    const historySql = getHistorySql(tableName, nextId);

    // Получим значения для первого и последнего шагов сформированной для пользователя истории
    const records = await this.sequelize.query(
      historySql,
      { raw: true, type: QueryTypes.SELECT, }
    );

    return records as HistoryList;
  }
}

export default HistoryService;
