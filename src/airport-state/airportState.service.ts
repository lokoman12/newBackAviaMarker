import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import ToiService, { ActualClientToi, GeneralToiResponseType } from 'src/toi/toi.service';
import { AirportState, emptyAirportState } from './types';
import OmnicomService, { GeneralOmnicomResponseType } from 'src/omnicom/omnicom.service';
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
import HistoryService from 'src/history/history.service';
import { RecordStatusService } from 'src/user-history/record.status.service';

@Injectable()
export default class AirportStateService {
  private readonly logger = new Logger(AirportStateService.name);

  constructor(
    private readonly configService: ApiConfigService,
    private readonly toiService: ToiService,
    private readonly aznbService: AznbService,
    private readonly omnicomService: OmnicomService,
    private readonly standService: StandService,
    private readonly positionService: PositionService,
    private readonly stripsService: StripsService,
    private readonly meteoService: MeteoService,
    private readonly alarmsService: AlarmService,
    private readonly taxiwayService: TaxiwayService,
    private readonly vppService: VppService,
    private readonly podhodService: PodhodService,
    private readonly standGeoService: StandGeoService,
    private readonly historyService: HistoryService,
    private readonly recordStatusService: RecordStatusService
  ) {
    this.logger.log('Init service');
  }

  async getActualData(username: string): Promise<AirportState> {
    try {
      // Если включено воспроизведение истории, заполняем данными из исторических таблиц, вместо актуальных значений
      let toi: GeneralToiResponseType;
      let omnicom: GeneralOmnicomResponseType;
      const isRecording = await this.recordStatusService.isInRecordStatus(username);
      if (isRecording) {
        toi = await this.historyService.getCurrentToiHistory(username);
        omnicom = [];
      } else {
        toi = await this.toiService.getActualClientData();
        omnicom = await this.omnicomService.getActualData();
      }

      const aznb = await this.aznbService.getActualData();
      const stands = await this.standService.getActualData();
      const strip = await this.stripsService.getActualData();
      const meteo = await this.meteoService.getActualData();
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
