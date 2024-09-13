import { Logger } from "@nestjs/common";
import dayjs from "../utils/dayjs";
import { DATE_TIME_FORMAT } from "src/auth/consts";
import { isNumber, isObject, isDate } from 'lodash';
import { TimelineRecordParametersTypes } from "./types";
import { TimelineRecordAllParametersType } from "./types";
import { TimelineRecordFromUserHistoryInfoParametersType } from "./types";
import { TimelineRecordFromCopyDtoType } from "./types";

const isTimelineRecordAllParametersType = (param: TimelineRecordParametersTypes): param is TimelineRecordAllParametersType => {
  return isNumber((param as TimelineRecordAllParametersType)?.startToiId)
    && isNumber((param as TimelineRecordAllParametersType)?.endToiId)
    && isNumber((param as TimelineRecordAllParametersType)?.currentToiId);
};

const isTimelineRecordFromUserHistoryInfoParametersType = (param: TimelineRecordParametersTypes): param is TimelineRecordFromUserHistoryInfoParametersType => {
  return isObject((param as TimelineRecordFromUserHistoryInfoParametersType)?.toiRecord)
    && isObject((param as TimelineRecordFromUserHistoryInfoParametersType)?.omnicomRecord)
    && isObject((param as TimelineRecordFromUserHistoryInfoParametersType)?.meteoRecord)
    && isNumber((param as TimelineRecordFromUserHistoryInfoParametersType)?.toiRecord?.startId)
    && isNumber((param as TimelineRecordFromUserHistoryInfoParametersType)?.toiRecord?.endId);
};

const isTimelineRecordFromCopyDtoType = (param: TimelineRecordParametersTypes): param is TimelineRecordFromCopyDtoType => {
  return isObject((param as TimelineRecordFromCopyDtoType)?.fromDto)
    && isNumber((param as TimelineRecordFromCopyDtoType)?.nextCurrentStep)
    && isDate((param as TimelineRecordFromCopyDtoType)?.nextCurrentTime);
};

export class TimelineRecordDto {
  private readonly logger = new Logger(TimelineRecordDto.name);

  login: string;
  startTime: Date;
  endTime: Date;
  currentTime: Date;

  startToiId: number;
  endToiId: number;
  currentToiId: number;

  startOmnicomId: number;
  endOmnicomId: number;
  currentOmnicomId: number;

  startMeteoId: number;
  endMeteoId: number;
  currentMeteoId: number;

  velocity: number;
  tableNumber: number;

  private setCommonProperties(params: TimelineRecordAllParametersType | TimelineRecordFromUserHistoryInfoParametersType | TimelineRecordDto) {
    this.login = params.login;
    this.startTime = params.startTime;
    this.endTime = params.endTime;
    this.currentTime = params.currentTime;
    this.velocity = params.velocity;
    this.tableNumber = params.tableNumber;
  }

  constructor(params: TimelineRecordAllParametersType | TimelineRecordFromUserHistoryInfoParametersType | TimelineRecordFromCopyDtoType) {
    if (isTimelineRecordAllParametersType(params)) {
      this.setCommonProperties(params);

      this.startToiId = params.startToiId;
      this.endToiId = params.endToiId;
      this.currentToiId = params.currentToiId;

      this.startOmnicomId = params.startOmnicomId;
      this.endOmnicomId = params.endOmnicomId;
      this.currentOmnicomId = params.currentOmnicomId;

      this.startMeteoId = params.startMeteoId;
      this.endMeteoId = params.endMeteoId;
      this.currentMeteoId = params.currentMeteoId;
    } else if (isTimelineRecordFromUserHistoryInfoParametersType(params)) {
      this.setCommonProperties(params);

      this.startToiId = params.toiRecord.startId;
      this.endToiId = params.toiRecord.endId;
      this.currentToiId = params.toiRecord.startId;

      this.startOmnicomId = params.omnicomRecord.startId;
      this.endOmnicomId = params.omnicomRecord.endId;
      this.currentOmnicomId = params.omnicomRecord.startId;

      this.startMeteoId = params.meteoRecord.startId;
      this.endMeteoId = params.meteoRecord.endId;
      this.currentMeteoId = params.meteoRecord.startId;
    } else {
      this.setCommonProperties(params.fromDto);
      this.currentToiId = params.nextCurrentStep;
      this.currentOmnicomId = params.nextCurrentStep;
      this.currentMeteoId = params.nextCurrentStep;
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

      startOmnicomId: this.startOmnicomId,
      endOmnicomId: this.endOmnicomId,
      currentOmnicomId: this.currentOmnicomId,

      startMeteoId: this.startMeteoId,
      endMeteoId: this.endMeteoId,
      currentMeteoId: this.currentMeteoId,

      velocity: this.velocity,
      tableNumber: this.tableNumber,
    };
  }

  private checkAndSwapIfStartMoreThenEnd<T>(startId: T, endId: T) {
    if (startId > endId) {
      return { endId, startId, };
    } else {
      return { startId, endId, };
    }
  }

  public asJsonString(): string {
    // При сохранении проверяем, чтобы старт не оказался больше энда. Коли так, обменяем значения
    const { startId: startToiId, endId: endToiId } = this.checkAndSwapIfStartMoreThenEnd(this.startToiId, this.endToiId);
    const { startId: startOmnicomId, endId: endOmnicomId } = this.checkAndSwapIfStartMoreThenEnd(this.startOmnicomId, this.endOmnicomId);
    const { startId: startMeteoId, endId: endMeteoId } = this.checkAndSwapIfStartMoreThenEnd(this.startMeteoId, this.endMeteoId);
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

      startOmnicomId: startOmnicomId,
      endOmnicomId: endOmnicomId,
      currentOmnicomId: this.currentOmnicomId,

      startMeteoId: startMeteoId,
      endMeteoId: endMeteoId,
      currentMeteoId: this.currentMeteoId,
    });
  }

  public static fromJsonString(valueString: string): TimelineRecordDto | null {
    const logger = new Logger(TimelineRecordDto.name);
    try {
      const json = JSON.parse(valueString);
      return new TimelineRecordDto({
        login: json.login,
        startTime: dayjs.utc(json.startTime, DATE_TIME_FORMAT).toDate(),
        endTime: dayjs.utc(json.endTime, DATE_TIME_FORMAT).toDate(),
        currentTime: dayjs.utc(json.currentTime, DATE_TIME_FORMAT).toDate(),
        velocity: json.velocity, tableNumber: json.tableNumber,

        startToiId: json.startToiId,
        endToiId: json.endToiId,
        currentToiId: json.currentToiId,

        startOmnicomId: json.startOmnicomId,
        endOmnicomId: json.endOmnicomId,
        currentOmnicomId: json.currentOmnicomId,

        startMeteoId: json.startMeteoId,
        endMeteoId: json.endMeteoId,
        currentMeteoId: json.currentMeteoId
      });
    } catch (e) {
      logger.error(`Строку ${valueString} невозможно преобразовать в тип TimelineRecordDto`, e);
      return null;
    }
  }
}
