import { Module } from '@nestjs/common';
import TimelineService from './timelineService';
import { ExternalScheduler } from './external.scheduler';
import { ApiConfigModule } from 'src/config/config.module';
import { SequelizeModule } from '@nestjs/sequelize';
import User from 'src/db/models/user';
import Settings from 'src/db/models/settings';
import { TimelineController } from './timeline.controller';
import { SettingsModule } from 'src/settings/settings.module';
import { RecordStatusService } from './record.status.service';

@Module({
  providers: [TimelineService, ExternalScheduler, RecordStatusService],
  imports: [ApiConfigModule, SequelizeModule.forFeature([User, Settings]), SettingsModule,],
  controllers: [TimelineController,],
  exports: [TimelineService, ExternalScheduler],
})
export class TimelineModule { }