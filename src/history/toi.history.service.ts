import { Injectable, Logger } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/sequelize";
import ToiHistory from "src/db/models/toiHistory.model";
import { RecordStatusService, } from "../user-history/record.status.service";
import { Sequelize } from "sequelize";
import { TimelineRecordDto } from "src/user-history/timeline.record.dto";
import HistoryService from "./history.service";
import { NextCurrentTypeForResponse } from "src/user-history/types";
import { DEFAULT_PART_SIZE } from "src/user-history/sql";
import { HistoryArrayOfLists, ToiHistoryArrayOfLists } from "./types";
import { mapValues } from 'lodash';

@Injectable()
class ToiHistoryService extends HistoryService<ToiHistory> {
  protected readonly logger = new Logger(ToiHistoryService.name);

  constructor(
    @InjectConnection()
    protected readonly sequelize: Sequelize,
    protected readonly recordStatusService: RecordStatusService,
    @InjectModel(ToiHistory) protected readonly historyModel: typeof ToiHistory
  ) {
    super(sequelize, historyModel);
    this.logger.log('Сервис инициализирован!')
  }

  getNextId(status: TimelineRecordDto): number {
    const nextValue = status.currentToiId + DEFAULT_PART_SIZE;
    return nextValue >= status.endToiId ? status.endToiId : nextValue;
  }

  public async getHistoryAllRecords(tableNumber: number, startStep?: number, finishStep?: number): Promise<HistoryArrayOfLists> {
    const result = await super.getHistoryAllRecords(tableNumber, startStep, finishStep) as ToiHistoryArrayOfLists;
    return mapValues(result, (historyItem) => {
      return historyItem.map(toiItem => {
        return {
        ...toiItem,
        formular: toiItem.formular?.[0],
      }})
    });
  }

  async updateStateIfRequiredAndGetNextState(login: string, nextId: number, status: TimelineRecordDto): Promise<NextCurrentTypeForResponse> {
    const currentTime = await this.getCurrentTimeByStep(nextId, status.tableNumber);

    const nextCurrent = await this.recordStatusService.setNextCurrentPropertiesRecordStatus(
      login, nextId, currentTime || status.currentTime
    );

    const nextCurrentStep = nextCurrent.nextCurrentStep;
    const nextCurrentTime = nextCurrent.nextCurrentTime;
    this.assertNextStepValue(login, nextCurrentStep);

    return {
      nextCurrentStep,
      nextCurrentTime,
    };
  }
}

export default ToiHistoryService;
