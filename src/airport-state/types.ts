import { EMPTY_ARRAY } from "src/consts/common";
import AlaramAM from "src/db/models/alarm.model";
import AODB from "src/db/models/fpln.model";
import Podhod from "src/db/models/podhod.model";
import PositionAM from "src/db/models/position.model";
import StandsGeo from "src/db/models/standsGeo.model";
import Strips from "src/db/models/strips.model";
import Taxiway from "src/db/models/taxiway.model";
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
  strip: Array<Strips>;
  vppStatus: Array<VppStatus>;
  standsGeo: Array<StandsGeo>;
  alarms: Array<AlaramAM>;
  taxiway: Array<Taxiway>;
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
  toi: EMPTY_ARRAY,
  omnicom: EMPTY_ARRAY,
  meteo: EMPTY_ARRAY,
  stands: EMPTY_ARRAY,
  aznb: EMPTY_ARRAY,
  podhod: EMPTY_ARRAY,
  position: EMPTY_ARRAY,
  fpln: EMPTY_ARRAY,
  strip: EMPTY_ARRAY,
  vppStatus: EMPTY_ARRAY,
  standsGeo: EMPTY_ARRAY,
  alarms: EMPTY_ARRAY,
  taxiway: EMPTY_ARRAY,
  zones: EMPTY_ARRAY
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
  toi: EMPTY_ARRAY,
  omnicom: EMPTY_ARRAY,
  meteo: EMPTY_ARRAY,
  stands: EMPTY_ARRAY,
  aznb: EMPTY_ARRAY,
};