import { TimelineRecordDto } from "./timeline.record.dto";

export type RecordStatusResponseType = TimelineRecordDto | null;

export type NextCurrentType = { 
  nextCurrentTime: Date;
  nextCurrentStep: number;
};