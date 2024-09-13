import { TimelineRecordDto } from "./timeline.record.dto";
import { UserHistoryInfoType } from "./record.status.service";

export type RecordStatusResponseType = TimelineRecordDto | null;

export type NextCurrentTypeForDb = { 
  nextCurrentTime: Date;
  nextCurrentStep: number;
};

export type NextCurrentTypeForResponse = {
  nextCurrentTime: number;
  nextCurrentStep: number;
};

export class TimelineDto {
  currentToiId?: number;
  currentOmnicomId?: number;
  currentTime: number;
}

export type InsertHistorySqlType = (tableName: string, timeStart: Date, timeEnd: Date) => string;
export type OnlyTablenameParamSqlType = (tableName: string) => string;
export type CurrentHistoryInfoSql = (tablename: string, step: number) => string;export type TimelineRecordCommonParametersType = {
  login: string;
  startTime: Date;
  endTime: Date;
  currentTime: Date;

  velocity: number;
  tableNumber: number;
};
export type TimelineRecordParametersTypes = TimelineRecordAllParametersType | TimelineRecordFromUserHistoryInfoParametersType | TimelineRecordFromCopyDtoType;
export type TimelineRecordAllParametersType = TimelineRecordCommonParametersType & {
  startToiId: number;
  endToiId: number;
  currentToiId: number;

  startOmnicomId: number;
  endOmnicomId: number;
  currentOmnicomId: number;

  startMeteoId: number;
  endMeteoId: number;
  currentMeteoId: number;
};
export type TimelineRecordFromUserHistoryInfoParametersType = TimelineRecordCommonParametersType & UserHistoryInfoType;
export type TimelineRecordFromCopyDtoType = {
  nextCurrentStep: number;
  nextCurrentTime: Date;
  fromDto: TimelineRecordDto;
};

