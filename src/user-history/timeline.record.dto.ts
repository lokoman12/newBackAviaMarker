import { Logger } from "@nestjs/common";
import dayjs from "../utils/dayjs";
import { DATE_TIME_FORMAT } from "src/auth/consts";
import { HistoryGenerateStagesEnumKeys, HistoryGenerateStagesType, NextCurrentTypeForDb, TimelineRecordAllParametersType, TimelineRecordCommonParametersType, isTimelineRecordAllParametersType, isTimelineRecordCommonParametersType, isTimelineRecordFromUserHistoryInfoParametersType } from "./types";
import { TimelineRecordFromUserHistoryInfoParametersType } from "./types";
import { TimelineRecordFromCopyDtoType } from "./types";
import { isObject, isBoolean } from 'lodash';
import { UserHistoryInfoType } from "./record.status.service";

export class TimelineRecordDto {
  private readonly logger = new Logger(TimelineRecordDto.name);

  login: string;
  startTime: Date;
  endTime: Date;
  currentTime: Date;

  velocity: number;
  tableNumber: number;

  startToiId?: number;
  endToiId?: number;
  currentToiId?: number;

  endOmnicomId?: number;
  endMeteoId?: number;
  endStandsId?: number;
  endAznbId?: number;

  historyGenerateStages: HistoryGenerateStagesType;

  private setCommonProperties(params: TimelineRecordCommonParametersType | TimelineRecordAllParametersType | TimelineRecordFromUserHistoryInfoParametersType | TimelineRecordDto) {
    this.login = params.login;
    this.startTime = params.startTime;
    this.endTime = params.endTime;
    this.currentTime = params.currentTime;
    this.velocity = params.velocity;
    this.tableNumber = params.tableNumber;
    this.historyGenerateStages = params.historyGenerateStages;
  }

  constructor(params: TimelineRecordCommonParametersType | TimelineRecordAllParametersType | TimelineRecordFromUserHistoryInfoParametersType | TimelineRecordFromCopyDtoType) {
    if (isTimelineRecordCommonParametersType(params)) {
      this.setCommonProperties(params);
    } else if (isTimelineRecordAllParametersType(params)) {
      this.setCommonProperties(params);

      this.startToiId = params.startToiId;
      this.endToiId = params.endToiId;
      this.currentToiId = params.currentToiId;

      this.endOmnicomId = params.endOmnicomId;
      this.endMeteoId = params.endMeteoId;
      this.endStandsId = params.endStandsId;
      this.endAznbId = params.endAznbId;

    } else if (isTimelineRecordFromUserHistoryInfoParametersType(params)) {
      this.setCommonProperties(params);

      this.startToiId = params.toiRecord.startId;
      this.endToiId = params.toiRecord.endId;
      this.currentToiId = params.toiRecord.startId;

      this.endOmnicomId = params.omnicomRecord.endId;
      this.endMeteoId = params.meteoRecord.endId;
      this.endStandsId = params.standsRecord.endId;
      this.endAznbId = params.standsRecord.endId;
    } else {
      this.setCommonProperties(params.fromDto);
      this.startToiId = params.fromDto.startToiId;
      this.endToiId = params.fromDto.endToiId;

      this.endOmnicomId = params.fromDto.endOmnicomId;
      this.endMeteoId = params.fromDto.endMeteoId;
      this.endStandsId = params.fromDto.endStandsId;
      this.endAznbId = params.fromDto.endAznbId;

      this.currentToiId = params.nextCurrentStep;
      this.currentTime = params.nextCurrentTime;
    }
  }

  public getAsObject(): object {
    return {
      login: this.login,
      startTime: this.startTime,
      endTime: this.endTime,
      currentTime: this.currentTime,

      startToiId: this.startToiId,
      endToiId: this.endToiId,
      currentToiId: this.currentToiId,

      endOmnicomId: this.endOmnicomId,
      endMeteoId: this.endMeteoId,
      endStandsId: this.endStandsId,
      endAznbId: this.endAznbId,

      velocity: this.velocity,
      tableNumber: this.tableNumber,
      historyGenerateStages: this.historyGenerateStages,
    };
  }

  private checkAndSwapIfStartMoreThenEnd<T>(startId: T, endId: T) {
    if (startId > endId) {
      return { endId, startId, };
    } else {
      return { startId, endId, };
    }
  }

  public addHistoryGenerationStage(stage: HistoryGenerateStagesEnumKeys, result: boolean) {
    this.historyGenerateStages[stage] = result;
  }

  public setHistoriesInfo(info: UserHistoryInfoType): TimelineRecordDto {
    this.startToiId = info.toiRecord.startId;
    this.endToiId = info.toiRecord.endId;
    this.currentToiId = info.toiRecord.startId;

    this.endOmnicomId = info.omnicomRecord.endId;
    this.endMeteoId = info.meteoRecord.endId;
    this.endStandsId = info.standsRecord.endId;
    this.endAznbId = info.standsRecord.endId;

    return this;
  }

  public setNextCurrent(info: NextCurrentTypeForDb) {
    this.currentTime = info.nextCurrentTime;
    this.currentToiId = info.nextCurrentStep;
  }

  public clone() {
    return new TimelineRecordDto({
      login: this.login,
      startTime: this.startTime, endTime: this.endTime, currentTime: this.currentTime,
      startToiId: this.startToiId, endToiId: this.endToiId, currentToiId: this.currentToiId,
      endOmnicomId: this.endOmnicomId,
      endMeteoId: this.endMeteoId,
      endStandsId: this.endStandsId,
      endAznbId: this.endAznbId,
      velocity: this.velocity, tableNumber: this.tableNumber,
      historyGenerateStages: this.historyGenerateStages,
    });
  }

  public asJsonString(): string {
    // При сохранении проверяем, чтобы старт не оказался больше энда. Коли так, обменяем значения
    const { startId: startToiId, endId: endToiId } = this.checkAndSwapIfStartMoreThenEnd(this.startToiId, this.endToiId);
    const { startId: startTime, endId: endTime } = this.checkAndSwapIfStartMoreThenEnd(this.startTime, this.endTime);

    return JSON.stringify({
      login: this.login,
      startTime, endTime,
      velocity: this.velocity,
      tableNumber: this.tableNumber,

      currentTime: this.currentTime,

      startToiId: startToiId,
      endToiId: endToiId,
      currentToiId: this.currentToiId,

      endOmnicomId: this.endOmnicomId,
      endMeteoId: this.endMeteoId,
      endStandsId: this.endStandsId,
      endAznbId: this.endAznbId,

      historyGenerateStages: this.historyGenerateStages,
    });
  }

  public static fromJsonString(valueString: string): TimelineRecordDto | null {
    const logger = new Logger(TimelineRecordDto.name);
    try {
      const json = JSON.parse(valueString);
      const {
        login, velocity, tableNumber,
        startTime, endTime, currentTime,
        startToiId, endToiId, currentToiId,
        endOmnicomId,
        endMeteoId,
        endStandsId,
        endAznbId,
        historyGenerateStages,
      } = json;
      return new TimelineRecordDto({
        login,

        startTime: dayjs.utc(startTime, DATE_TIME_FORMAT).toDate(),
        endTime: dayjs.utc(endTime, DATE_TIME_FORMAT).toDate(),
        currentTime: dayjs.utc(currentTime, DATE_TIME_FORMAT).toDate(),

        velocity, tableNumber,

        startToiId, endToiId, currentToiId,
        endOmnicomId,
        endMeteoId,
        endStandsId,
        endAznbId,
        historyGenerateStages: isObject(historyGenerateStages) ? historyGenerateStages : {},
      });
    } catch (e) {
      logger.error(`Строку ${valueString} невозможно преобразовать в тип TimelineRecordDto`, e);
      return null;
    }
  }
}
