import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import Toi from 'src/db/models/toi.model';
import Formular from 'src/db/models/Formular.model';
import { ApiConfigModule } from 'src/config/config.module';
import ToiHistory from 'src/db/models/toiHistory.model';
import { CheckHistoryService } from './checkHistory.service';
import { ExternalScheduler } from 'src/history/external.scheduler';
import { HistoryModule } from 'src/history/history.module';


@Module({
  imports: [ApiConfigModule, HistoryModule, SequelizeModule.forFeature([ToiHistory])],
  providers: [CheckHistoryService],
  exports: [SequelizeModule],
})
export class CheckHistoryModule { }