import { Module } from '@nestjs/common';
import HistoryService from './historyService';
import { ExternalScheduler } from './external.scheduler';
import { ApiConfigModule } from 'src/config/config.module';
import { SequelizeModule } from '@nestjs/sequelize';
import User from 'src/db/models/user';
import Settings from 'src/db/models/settings';
import { HistoryController } from './history.controller';
import { SettingsModule } from 'src/settings/settings.module';
import { RecordStatusService } from './record.status.service';

@Module({
  providers: [HistoryService, ExternalScheduler, RecordStatusService],
  imports: [ApiConfigModule, SequelizeModule.forFeature([User, Settings]), SettingsModule,],
  controllers: [HistoryController,],
  exports: [HistoryService, ExternalScheduler],
})
export class HistoryModule { }