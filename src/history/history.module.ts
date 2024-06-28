import { Module } from '@nestjs/common';
import { ApiConfigModule } from 'src/config/config.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { HistoryController } from './history.controller';
import { SettingsModule } from 'src/settings/settings.module';
import Toi from 'src/db/models/toi.model';
import ToiHistory from 'src/db/models/toiHistory.model';
import { ToiModule } from 'src/toi/toi.module';
import { RecordStatusController } from '../user-history/record.status.controller';
import HistoryService from './history.service';
import { UserHistoryModule } from 'src/user-history/user.history.module';

@Module({
  providers: [HistoryService,],
  imports: [ApiConfigModule, SettingsModule, SequelizeModule.forFeature([Toi, ToiHistory]), ToiModule, UserHistoryModule],
  controllers: [HistoryController, RecordStatusController,],
  exports: [HistoryService, ],
})
export class HistoryModule { }