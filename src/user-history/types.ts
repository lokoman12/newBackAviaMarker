import { TimelineRecordDto } from "./timeline.record.dto";
import { UserHistoryInfoType } from "./record.status.service";
import { isNumber, isObject, isDate } from 'lodash';

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
  currentMeteoId?: number;
  currentStandsId?: number;
  currentAznbId?: number;
  currentTime: number;
}

export type InsertHistorySqlType = (baseTableName: string, recordTableName: string, timeStart: Date, timeEnd: Date) => string;

export type OnlyTablenameParamSqlType = (tableName: string) => string;

export type CurrentHistoryInfoSql = (tablename: string, step: number) => string;

export type TimelineRecordCommonParametersType = {
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

  startStandsId: number;
  endStandsId: number;
  currentStandsId: number;

  startAznbId: number;
  endAznbId: number;
  currentAznbId: number;
};

export type TimelineRecordFromUserHistoryInfoParametersType = TimelineRecordCommonParametersType & UserHistoryInfoType;

export type TimelineRecordFromCopyDtoType = {
  nextCurrentStep: number;
  nextCurrentTime: Date;
  fromDto: TimelineRecordDto;
};

export const isTimelineRecordAllParametersType = (param: TimelineRecordParametersTypes): param is TimelineRecordAllParametersType => {
  return isNumber((param as TimelineRecordAllParametersType)?.startToiId)
    && isNumber((param as TimelineRecordAllParametersType)?.endToiId)
    && isNumber((param as TimelineRecordAllParametersType)?.currentToiId);
};

export const isTimelineRecordFromUserHistoryInfoParametersType = (param: TimelineRecordParametersTypes): param is TimelineRecordFromUserHistoryInfoParametersType => {
  return isObject((param as TimelineRecordFromUserHistoryInfoParametersType)?.toiRecord)
    && isObject((param as TimelineRecordFromUserHistoryInfoParametersType)?.omnicomRecord)
    && isObject((param as TimelineRecordFromUserHistoryInfoParametersType)?.meteoRecord)
    && isNumber((param as TimelineRecordFromUserHistoryInfoParametersType)?.toiRecord?.startId)
    && isNumber((param as TimelineRecordFromUserHistoryInfoParametersType)?.toiRecord?.endId);
};

export const isTimelineRecordFromCopyDtoType = (param: TimelineRecordParametersTypes): param is TimelineRecordFromCopyDtoType => {
  return isObject((param as TimelineRecordFromCopyDtoType)?.fromDto)
    && isNumber((param as TimelineRecordFromCopyDtoType)?.nextCurrentStep)
    && isDate((param as TimelineRecordFromCopyDtoType)?.nextCurrentTime);
};
