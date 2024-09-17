import { Logger } from "@nestjs/common";
import dayjs from "../utils/dayjs";
import { DATE_TIME_FORMAT } from "src/auth/consts";
import { TimelineRecordAllParametersType, isTimelineRecordAllParametersType, isTimelineRecordFromUserHistoryInfoParametersType } from "./types";
import { TimelineRecordFromUserHistoryInfoParametersType } from "./types";
import { TimelineRecordFromCopyDtoType } from "./types";

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

      this.startToiId = params.fromDto.startToiId;
      this.endToiId = params.fromDto.endToiId;

      this.startOmnicomId = params.fromDto.startOmnicomId;
      this.endOmnicomId = params.fromDto.endOmnicomId;

      this.startMeteoId = params.fromDto.startMeteoId;
      this.endMeteoId = params.fromDto.endMeteoId;

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
      const {
        login, velocity, tableNumber,
        startTime, endTime, currentTime,
        startToiId, endToiId, currentToiId,
        startOmnicomId, endOmnicomId, currentOmnicomId,
        startMeteoId, endMeteoId, currentMeteoId
      } = json;

      return new TimelineRecordDto({
        login,

        startTime: dayjs.utc(startTime, DATE_TIME_FORMAT).toDate(),
        endTime: dayjs.utc(endTime, DATE_TIME_FORMAT).toDate(),
        currentTime: dayjs.utc(currentTime, DATE_TIME_FORMAT).toDate(),

        velocity, tableNumber,

        startToiId, endToiId, currentToiId,
        startOmnicomId, endOmnicomId, currentOmnicomId,
        startMeteoId, endMeteoId, currentMeteoId
      });
    } catch (e) {
      logger.error(`Строку ${valueString} невозможно преобразовать в тип TimelineRecordDto`, e);
      return null;
    }
  }
}
