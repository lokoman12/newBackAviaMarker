import { strips, taxiway } from "@prisma/client";
import AlaramAM from "src/db/models/alarm.model";
import AODB from "src/db/models/fpln.model";
import Podhod from "src/db/models/podhod.model";
import PositionAM from "src/db/models/position.model";
import StandsGeo from "src/db/models/standsGeo.model";
import VppStatus from "src/db/models/vppStatus.model";
import ZoneAM from "src/db/models/zone.model";
import { HistoryArrayOfLists } from "src/history/types";
import { GeneralResponseType } from "src/toi/toi.service";

export type AirportState = {
  toi: GeneralResponseType;
  omnicom: GeneralResponseType;
  meteo: GeneralResponseType;
  stands: GeneralResponseType;
  aznb: GeneralResponseType,
  podhod: Array<Podhod>;
  position: Array<PositionAM>;
  fpln: Array<AODB>;
  strip: Array<strips>;
  vppStatus: Array<VppStatus>;
  standsGeo: Array<StandsGeo>;
  alarms: Array<AlaramAM>;
  taxiway: Array<taxiway>;
  zones: Array<ZoneAM>;
};

export type HistoryMetaInfoType = {
  startTime: number;
  currentTime: number;
  endTime: number;
  currentStep: number;
  allSteps: number;
  velocity?: number;
  tableNumber: number;
}

export type AirportStateAllHistory = {
  metaInfo: HistoryMetaInfoType,
  toi: HistoryArrayOfLists;
  omnicom: HistoryArrayOfLists;
  meteo: HistoryArrayOfLists;
  stands: HistoryArrayOfLists;
  aznb: HistoryArrayOfLists,
};

export const emptyAirportState = {
  toi: [],
  omnicom: [],
  meteo: [],
  stands: [],
  aznb: [],
  podhod: [],
  position: [],
  fpln: [],
  strip: [],
  vppStatus: [],
  standsGeo: [],
  alarms: [],
  taxiway: [],
  zones: []
};

export const emptyAirportStateHistory: AirportStateAllHistory = {
  metaInfo: {
    startTime: NaN,
    currentTime: NaN,
    endTime: NaN,
    currentStep: -1,
    allSteps: 0,
    velocity: 1,
    tableNumber: -1,
  },
  toi: [],
  omnicom: [],
  meteo: [],
  stands: [],
  aznb: [],
};