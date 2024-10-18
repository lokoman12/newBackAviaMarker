import { TimelineRecordDto } from "./timeline.record.dto";
import { isNumber, isObject, isString, isDate } from 'lodash';
import { isNull, nonNull } from "src/utils/common";
import { BadRequestException } from "@nestjs/common";
import { HistoryErrorCodeEnum } from "./user.bad.status.exception";

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

  historyGenerateStages: Record<HistoryGenerateStagesEnum, boolean> | {},
};
export type TimelineRecordParametersTypes = TimelineRecordCommonParametersType | TimelineRecordAllParametersType | TimelineRecordFromUserHistoryInfoParametersType | TimelineRecordFromCopyDtoType;

export type TimelineRecordUserAllInfoType = {
  startToiId: number;
  endToiId: number;
  currentToiId: number;

  endOmnicomId: number;
  endMeteoId: number;
  endStandsId: number;
  endAznbId: number;
};

export type TimelineRecordAllParametersType = TimelineRecordCommonParametersType & TimelineRecordUserAllInfoType;

export type TimelineRecordFromUserHistoryInfoParametersType = TimelineRecordCommonParametersType & UserHistoryInfoType;

export type TimelineRecordFromCopyDtoType = {
  nextCurrentStep: number;
  nextCurrentTime: Date;
  fromDto: TimelineRecordDto;
};

export const isTimelineRecordCommonParametersType = (params: TimelineRecordParametersTypes): params is TimelineRecordCommonParametersType => {
  return isNull((params as TimelineRecordAllParametersType)?.startToiId)
    && isNull((params as TimelineRecordAllParametersType)?.currentToiId)
    && isNumber((params as TimelineRecordCommonParametersType)?.tableNumber)
    && isString((params as TimelineRecordCommonParametersType)?.login)
    && isDate((params as TimelineRecordCommonParametersType)?.startTime)
    && isDate((params as TimelineRecordCommonParametersType)?.endTime);
};

export const isTimelineRecordAllParametersType = (params: TimelineRecordParametersTypes): params is TimelineRecordAllParametersType => {
  return isNumber((params as TimelineRecordAllParametersType)?.startToiId)
    && isNumber((params as TimelineRecordAllParametersType)?.endToiId)
    && isNumber((params as TimelineRecordAllParametersType)?.currentToiId);
};

export const isTimelineRecordFromUserHistoryInfoParametersType = (params: TimelineRecordParametersTypes): params is TimelineRecordFromUserHistoryInfoParametersType => {
  return isObject((params as TimelineRecordFromUserHistoryInfoParametersType)?.toiRecord)
    && isObject((params as TimelineRecordFromUserHistoryInfoParametersType)?.omnicomRecord)
    && isObject((params as TimelineRecordFromUserHistoryInfoParametersType)?.meteoRecord)
    && isNumber((params as TimelineRecordFromUserHistoryInfoParametersType)?.toiRecord?.startId)
    && isNumber((params as TimelineRecordFromUserHistoryInfoParametersType)?.toiRecord?.endId);
};

export const isTimelineRecordFromCopyDtoType = (params: TimelineRecordParametersTypes): params is TimelineRecordFromCopyDtoType => {
  return isObject((params as TimelineRecordFromCopyDtoType)?.fromDto)
    && isNumber((params as TimelineRecordFromCopyDtoType)?.nextCurrentStep)
    && isDate((params as TimelineRecordFromCopyDtoType)?.nextCurrentTime);
};

export enum HistoryGenerateStagesEnum {
  toi = 'toi_history',
  omnicom = 'omnicom_history',
  meteo = 'meteo_history',
  stands = 'stands_history',
  aznb = 'aznb_history'
}

export type HistoryGenerateStagesEnumKeys = keyof typeof HistoryGenerateStagesEnum;

export type HistoryGenerateStagesType = Record<HistoryGenerateStagesEnum, HistoryErrorCodeEnum> | {};

export const convertStringToHistoryGenerateStagesEnumKey = (param: string): HistoryGenerateStagesEnumKeys => {
  const enumInstance = Object.entries(HistoryGenerateStagesEnum).find(it => it[1] === param)?.[0];
  if (nonNull(enumInstance)) {
    return (enumInstance as unknown) as HistoryGenerateStagesEnumKeys;
  } else {
    throw new BadRequestException(`Can not map table name ${param} to stage`);
  }
};

export const capitalizeFirstLetter = (input: string) => {
  return input.charAt(0).toUpperCase() + input.slice(1);
}

export interface CurrentTimeRecord {
  currentId: number;
  currentTime: number;
}

export interface TimelineStartRecordResponse {
  allRecs: number;
  startId: number;
  endId: number;
}

export interface TimelineStartRecordRequest {
  timeStart: number;
  timeEnd: number;
  velocity: number;
}

export type UserHistoryInfoType = {
  toiRecord: TimelineStartRecordResponse;
  omnicomRecord: TimelineStartRecordResponse;
  meteoRecord: TimelineStartRecordResponse;
  standsRecord: TimelineStartRecordResponse;
  aznbRecord: TimelineStartRecordResponse;
};

export const getInitUserAllInfo = (): UserHistoryInfoType => {
  return {
    toiRecord: {
      allRecs: 0,
      startId: 0,
      endId: 0
    },
    omnicomRecord: {
      allRecs: 0,
      startId: 0,
      endId: 0
    },
    meteoRecord: {
      allRecs: 0,
      startId: 0,
      endId: 0
    },
    standsRecord: {
      allRecs: 0,
      startId: 0,
      endId: 0
    },
    aznbRecord: {
      allRecs: 0,
      startId: 0,
      endId: 0
    },
  }
};
