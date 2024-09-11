import AlaramAM from "src/db/models/alarm.model";
import Aznb from "src/db/models/aznb.model";
import AODB from "src/db/models/fpln.model";
import Meteo from "src/db/models/meteo.model";
import Podhod from "src/db/models/podhod.model";
import PositionAM from "src/db/models/position.model";
import Stands from "src/db/models/stands.model";
import StandsGeo from "src/db/models/standsGeo.model";
import Strips from "src/db/models/strips.model";
import Taxiway from "src/db/models/taxiway.model";
import VppStatus from "src/db/models/vppStatus.model";
import ZoneAM from "src/db/models/zone.model";
import { GeneralOmnicomResponseType } from "src/omnicom/omnicom.service";
import { GeneralToiResponseType } from "src/toi/toi.service";

export type AirportState = {
  toi: GeneralToiResponseType;
  aznb: Array<Aznb>,
  podhod: Array<Podhod>;
  stands: Array<Stands>;
  meteo: Array<Meteo>;
  position: Array<PositionAM>;
  fpln: Array<AODB>;
  strip: Array<Strips>;
  vppStatus: Array<VppStatus>;
  omnicom: GeneralOmnicomResponseType;
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