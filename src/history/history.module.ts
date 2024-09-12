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

@Module({
  imports: [ApiConfigModule, SettingsModule, SequelizeModule.forFeature([Toi, ToiHistory, OmnicomHistory]), ToiModule, OmnicomModule, UserHistoryModule],
  providers: [ToiHistoryService, OmnicomHistoryService],
  controllers: [HistoryController, RecordStatusController,],
  exports: [ToiHistoryService, OmnicomHistoryService],
})
export class HistoryModule { }