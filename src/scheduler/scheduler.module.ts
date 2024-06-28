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

@Module({
  providers: [ExternalScheduler, ToiCopyToHistoryScheduler, ToadScheduler, CheckHistoryService],
  imports: [ApiConfigModule, HistoryModule, ToiModule, SequelizeModule.forFeature([ToiHistory])],
  controllers: [],
  exports: [ExternalScheduler,],
})
export class SchedulerModule { }