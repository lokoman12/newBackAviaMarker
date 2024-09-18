import { Module } from '@nestjs/common';
import { ApiConfigModule } from 'src/config/config.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { HistoryController } from '../history/history.controller';
import { SettingsModule } from 'src/settings/settings.module';
import Toi from 'src/db/models/toi.model';
import ToiHistory from 'src/db/models/toiHistory.model';
import { ToiModule } from 'src/toi/toi.module';
import { RecordStatusController } from '../user-history/record.status.controller';
import ToiHistoryService from './toi.history.service';
import { UserHistoryModule } from 'src/user-history/user.history.module';
import OmnicomHistory from 'src/db/models/scoutHistory.model';
import { OmnicomModule } from 'src/omnicom/omnicom.module';
import OmnicomHistoryService from './omnicom.history.service';
import { MeteoModule } from 'src/meteo/meteo.module';
import { StandsModule } from 'src/stand-aodb/stand.aodb.module';
import AznbHistory from 'src/db/models/aznbHistory.model';
import MeteoHistory from 'src/db/models/meteoHistory.model';
import StandsHistory from 'src/db/models/standsHistory.model';
import { AznbModule } from 'src/aznb/aznb.module';
import StandsHistoryService from './stands.history.service';
import AznbHistoryService from './aznb.history.service';
import MeteoHistoryService from './meteo.history.service';

@Module({
  imports: [ApiConfigModule, SettingsModule, SequelizeModule.forFeature([Toi, ToiHistory, OmnicomHistory, MeteoHistory, StandsHistory, AznbHistory]), ToiModule, OmnicomModule, MeteoModule, StandsModule, AznbModule, UserHistoryModule],
  providers: [ToiHistoryService, OmnicomHistoryService, MeteoHistoryService, StandsHistoryService, AznbHistoryService],
  controllers: [HistoryController, RecordStatusController,],
  exports: [ToiHistoryService, OmnicomHistoryService, MeteoHistoryService, StandsHistoryService, AznbHistoryService],
})
export class HistoryModule { }