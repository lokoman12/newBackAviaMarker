import { Logger } from "@nestjs/common";
import dayjs from "../utils/dayjs";
import { DATE_TIME_FORMAT } from "src/auth/consts";

export class TimelineRecordDto {
  private readonly logger = new Logger(TimelineRecordDto.name);

  constructor(
    readonly login: string,
    readonly startTime: Date,
    readonly endTime: Date,
    readonly currentTime: Date,
    readonly startId: number,
    readonly endId: number,
    readonly currentId: number,
    readonly velocity: number,
    readonly tableNumber: number
  ) { }

  public getAsObject(): object {
    return {
      login: this.login,
      startTime: this.startTime,
      endTime: this.endTime,
      currentTime: this.currentTime,
      startId: this.startId,
      endId: this.endId,
      currentId: this.currentId,
      velocity: this.velocity,
      tableNumber: this.tableNumber,
    };
  }

  public asJsonString(): string {
    // При сохранении проверяем, чтобы старт не оказался больше энда.
    // Коли так, обменяем значения
    let startId = this.startId;
    let endId = this.endId;
    if (startId > endId) {
      startId = this.endId;
      endId = this.startId;
    }

    let startTime = this.startTime;
    let endTime = this.endTime;
    if (startTime > endTime) {
      startTime = this.endTime;
      endTime = this.startTime;
    }

    return JSON.stringify({
      login: this.login,
      startTime,
      endTime,
      currentTime: this.currentTime,
      startId,
      endId,
      currentId: this.currentId,
      velocity: this.velocity,
      tableNumber: this.tableNumber,
    });
  }

  public static fromJsonString(valueString: string): TimelineRecordDto | null {
    const logger = new Logger(TimelineRecordDto.name);
    try {
      const json = JSON.parse(valueString);
      return new TimelineRecordDto(
        json.login, 
        dayjs.utc(json.startTime, DATE_TIME_FORMAT).toDate(),
        dayjs.utc(json.endTime, DATE_TIME_FORMAT).toDate(),
        dayjs.utc(json.currentTime, DATE_TIME_FORMAT).toDate(),
        json.startId,
        json.endId,
        json.currentId,
        json.velocity, json.tableNumber
      );
    } catch (e) {
      logger.error(`Строку ${valueString} невозможно преобразовать в тип TimelineRecordDto`, e);
      return null;
    }
  }
}
