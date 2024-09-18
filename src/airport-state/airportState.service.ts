import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import ToiService, { ActualClientToi } from 'src/toi/toi.service';
import { AirportState, emptyAirportState } from './types';
import OmnicomService from 'src/omnicom/omnicom.service';
import StandService from 'src/stand-aodb/stand.service';
import AznbService from 'src/aznb/aznb.service';
import PositionService from 'src/position/position.service';
import StripsService from 'src/strips/strips.service';
import { ApiConfigService } from 'src/config/api.config.service';
import MeteoService from 'src/meteo/meteo.service';
import AlarmService from 'src/alarm/alarm.service';
import TaxiwayService from 'src/taxiway/taxiway.service';
import VppService from 'src/vpp-status/vpp.service';
import PodhodService from 'src/podhod/podhod.service';
import StandGeoService from 'src/stand-geo/stand.geo.service';
import ToiHistoryService from 'src/history/toi.history.service';
import { RecordStatusService } from 'src/user-history/record.status.service';
import OmnicomHistoryService from 'src/history/omnicom.history.service';
import MeteoHistoryService from 'src/history/meteo.history.service';
import StandsHistoryService from 'src/history/stands.history.service';
import AznbHistoryService from 'src/history/aznb.history.service';
import { HistoryResponseType } from 'src/history/types';
import Scout from 'src/db/models/scout.model';
import Meteo from 'src/db/models/meteo.model';
import Stands from 'src/db/models/stands.model';
import Aznb from 'src/db/models/aznb.model';

@Injectable()
export default class AirportStateService {
  private readonly logger = new Logger(AirportStateService.name);

  constructor(
    private readonly configService: ApiConfigService,
    private readonly toiService: ToiService,
    private readonly aznbService: AznbService,
    private readonly omnicomService: OmnicomService,
    private readonly standsService: StandService,
    private readonly positionService: PositionService,
    private readonly stripsService: StripsService,
    private readonly meteoService: MeteoService,
    private readonly alarmsService: AlarmService,
    private readonly taxiwayService: TaxiwayService,
    private readonly vppService: VppService,
    private readonly podhodService: PodhodService,
    private readonly standGeoService: StandGeoService,
    private readonly toiHistoryService: ToiHistoryService,
    private readonly omnicomHistoryService: OmnicomHistoryService,
    private readonly meteoHistoryService: MeteoHistoryService,
    private readonly standsHistoryService: StandsHistoryService,
    private readonly aznbHistoryService: AznbHistoryService,
    private readonly recordStatusService: RecordStatusService
  ) {
    this.logger.log('Init service');
  }

  async getActualData(username: string): Promise<AirportState> {
    // Если включено воспроизведение истории, заполняем данными из исторических таблиц, вместо актуальных значений
    let toi: Array<ActualClientToi> | HistoryResponseType;
    let omnicom: Array<Scout> | HistoryResponseType;
    let meteo: Array<Meteo> | HistoryResponseType;;
    let stands: Array<Stands> | HistoryResponseType;
    let aznb: Array<Aznb> | HistoryResponseType;

    try {
      this.logger.log(`Airport-state getActualData, start, login: 
      ${username}`);
      const isRecording = await this.recordStatusService.isInRecordStatus(username);

      this.logger.log(`Airport-state getActualData, login: ${username}, isRecording: ${isRecording}`);
      if (isRecording) {
        toi = await this.toiHistoryService.getCurrentHistory(username);
        omnicom = await this.omnicomHistoryService.getCurrentHistory(username);
        meteo = await this.meteoHistoryService.getCurrentHistory(username);
        stands = await this.standsHistoryService.getCurrentHistory(username);
        aznb = await this.aznbHistoryService.getCurrentHistory(username);
      } else {
        toi = await this.toiService.getActualClientData();
        omnicom = await this.omnicomService.getActualData();
        meteo = await this.meteoService.getActualData();
        stands = await this.standsService.getActualData();
        aznb = await this.aznbService.getActualData();
      }

      const strip = await this.stripsService.getActualData();
      const taxiway = await this.taxiwayService.getActualData();
      const vppStatus = await this.vppService.getActualData();
      const podhod = await this.podhodService.getActualData();
      const standsGeo = await this.standGeoService.getActualData();

      const airportState = {
        ...emptyAirportState,
        toi,
        aznb,
        omnicom,
        stands,
        strip,
        meteo,
        taxiway,
        vppStatus,
        podhod,
        standsGeo,
      };

      if (this.configService.isActiveAirportUlli()) {
        const position = await this.positionService.getActualData();
        const fpln = await this.positionService.getActualData();
        const alarms = await this.alarmsService.getActualData();
        airportState['position'] = position;
        airportState['fpln'] = fpln;
        airportState['alarms'] = alarms;
      }

      return airportState;
    } catch (error) {
      console.error('Error retrieving airport info:', error);
      throw error;
    }
  }

}
