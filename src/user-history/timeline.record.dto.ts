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

    readonly startToiId: number,
    readonly endToiId: number,
    readonly currentToiId: number,

    readonly startOmnicomId: number,
    readonly endOmnicomId: number,
    readonly currentOmnicomId: number,

    readonly startMeteoId: number,
    readonly endMeteoId: number,
    readonly currentMeteoId: number,

    readonly velocity: number,
    readonly tableNumber: number
  ) { }

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

  public asJsonString(): string {
    // При сохранении проверяем, чтобы старт не оказался больше энда.
    // Коли так, обменяем значения
    let startToiId = this.startToiId;
    let endToiId = this.endToiId;
    if (startToiId > endToiId) {
      startToiId = this.endToiId;
      endToiId = this.startToiId;
    }

    let startOmnicomId = this.startOmnicomId;
    let endOmnicomId = this.endOmnicomId;
    if (startOmnicomId > endOmnicomId) {
      startOmnicomId = this.endOmnicomId;
      endOmnicomId = this.startOmnicomId;
    }

    let startMeteoId = this.startMeteoId;
    let endMeteoId = this.endMeteoId;
    if (startMeteoId > endMeteoId) {
      startMeteoId = this.endMeteoId;
      endMeteoId = this.startMeteoId;
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

      startToiId: startToiId,
      endToiId: endToiId,
      currentToiId: this.currentToiId,

      startOmnicomId: startOmnicomId,
      endOmnicomId: endOmnicomId,
      currentOmnicomId: this.currentOmnicomId,

      startMeteoId: startMeteoId,
      endMeteoId: endMeteoId,
      currentMeteoId: this.currentMeteoId,

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
        
        json.startToiId,
        json.endToiId,
        json.currentToiId,

        json.startOmnicomId,
        json.endOmnicomId,
        json.currentOmnicomId,
        
        json.startMeteoId,
        json.endMeteoId,
        json.currentMeteoId,
        
        json.velocity, json.tableNumber
      );
    } catch (e) {
      logger.error(`Строку ${valueString} невозможно преобразовать в тип TimelineRecordDto`, e);
      return null;
    }
  }
}
