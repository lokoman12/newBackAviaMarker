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

@Module({
  providers: [ExternalScheduler, ToiCopyToHistoryScheduler, OmnicomCopyToHistoryScheduler, MeteoCopyToHistoryScheduler, ToadScheduler, CheckHistoryService],
  imports: [ApiConfigModule, HistoryModule, ToiModule, OmnicomModule, MeteoModule, SequelizeModule.forFeature([ToiHistory, OmnicomHistory, MeteoHistory])],
  controllers: [],
  exports: [ExternalScheduler,],
})
export class SchedulerModule { }