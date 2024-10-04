import { Injectable, Logger } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/sequelize";
import ToiHistory from "src/db/models/toiHistory.model";
import { RecordStatusService, } from "../user-history/record.status.service";
import { Sequelize } from "sequelize";
import { TimelineRecordDto } from "src/user-history/timeline.record.dto";
import HistoryService from "./history.service";
import { NextCurrentTypeForResponse } from "src/user-history/types";

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

  getNextId(currentId: number): number {
    return currentId + 1;
  }

  async updateStateIfRequiredAndGetNextState(login: string, nextId: number, status: TimelineRecordDto): Promise<NextCurrentTypeForResponse> {
    const records = await this.getHistoryRecords(nextId, status);

    const nextCurrent = await this.recordStatusService.setNextCurrentPropertiesRecordStatus(
      login, nextId, records?.[0]?.time || status.currentTime
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
