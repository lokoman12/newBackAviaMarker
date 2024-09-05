import { Module } from '@nestjs/common';
import { ApiConfigModule } from 'src/config/config.module';
import { ExternalScheduler } from './external.scheduler';
import { HistoryModule } from 'src/history/history.module';
import ToiCopyToHistoryScheduler from './toi.copy.history.scheduler';
import { ToadScheduler } from 'toad-scheduler';
import { ToiModule } from 'src/toi/toi.module';
import ToiHistory from 'src/db/models/toiHistory.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { CheckHistoryService } from './checkHistory.service';
import OmnicomCopyToHistoryScheduler from './omnicom.copy.history.scheduler';
import OmnicomHistory from 'src/db/models/scoutHistory.model';
import { OmnicomModule } from 'src/omnicom/omnicom.module';
import MeteoHistory from 'src/db/models/meteoHistory.model';
import { MeteoModule } from 'src/meteo/meteo.module';
import MeteoCopyToHistoryScheduler from './meteo.copy.history.scheduler';
import StandsHistory from 'src/db/models/standsHistory.model';
import { StandsModule } from 'src/stand-aodb/stand.aodb.module';
import StandsCopyToHistoryScheduler from './stands.copy.history.scheduler';
import { AznbModule } from 'src/aznb/aznb.module';
import AznbHistory from 'src/db/models/aznbHistory.model';
import AznbCopyToHistoryScheduler from './aznb.copy.history.scheduler';

@Module({
  providers: [ExternalScheduler, ToiCopyToHistoryScheduler, OmnicomCopyToHistoryScheduler, MeteoCopyToHistoryScheduler, StandsCopyToHistoryScheduler, AznbCopyToHistoryScheduler, ToadScheduler, CheckHistoryService],
  imports: [ApiConfigModule, HistoryModule, ToiModule, OmnicomModule, MeteoModule, StandsModule, AznbModule, SequelizeModule.forFeature([ToiHistory, OmnicomHistory, MeteoHistory, StandsHistory, AznbHistory])],
  controllers: [],
  exports: [ExternalScheduler,],
})
export class SchedulerModule { }