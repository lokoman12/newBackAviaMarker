import { TimelineRecordDto } from "./timeline.record.dto";

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