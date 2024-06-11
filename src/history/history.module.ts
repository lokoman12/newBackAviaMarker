import { Module } from '@nestjs/common';
import HistoryService from './historyService';
import { ExternalScheduler } from './external.scheduler';
import { ApiConfigModule } from 'src/config/config.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { HistoryController } from './history.controller';
import { SettingsModule } from 'src/settings/settings.module';
import { RecordStatusService } from './record.status.service';
import Toi from 'src/db/models/toi.model';
import ToiHistory from 'src/db/models/toiHistory.model';
import { ToadScheduler } from 'toad-scheduler';
import ToiCopyToHistoryScheduler from './toi.copy.history.scheduler';
import { ToiModule } from 'src/toi/toi.module';
import ToiService from 'src/toi/toi.service';
import TimelineService from './timelineService';

@Module({
  providers: [HistoryService, ExternalScheduler, ToadScheduler, TimelineService, RecordStatusService, ToiCopyToHistoryScheduler, ToiService],
  imports: [ApiConfigModule, SettingsModule, SequelizeModule.forFeature([Toi, ToiHistory]), ToiModule],
  controllers: [HistoryController,],
  exports: [HistoryService, ExternalScheduler, ToiCopyToHistoryScheduler, TimelineService],
})
export class HistoryModule { }