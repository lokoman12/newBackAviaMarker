import AlaramAM from "src/db/models/alarm.model";
import AODB from "src/db/models/fpln.model";
import Podhod from "src/db/models/podhod.model";
import PositionAM from "src/db/models/position.model";
import StandsGeo from "src/db/models/standsGeo.model";
import Strips from "src/db/models/strips.model";
import Taxiway from "src/db/models/taxiway.model";
import VppStatus from "src/db/models/vppStatus.model";
import ZoneAM from "src/db/models/zone.model";
import { GeneralOmnicomResponseType } from "src/omnicom/omnicom.service";
import { GeneralResponseType } from "src/toi/toi.service";

export type AirportState = {
  toi: GeneralResponseType;
  omnicom: GeneralOmnicomResponseType;
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

export const emptyAirportState = {
  toi: [],
  aznb: [],
  podhod: [],
  stands: [],
  meteo: [],
  position: [],
  fpln: [],
  strip: [],
  vppStatus: [],
  omnicom: [],
  standsGeo: [],
  alarms: [],
  taxiway: [],
  zones: []
};