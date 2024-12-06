import { Module, forwardRef } from '@nestjs/common';
import { ApiConfigModule } from 'src/config/config.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { SettingsModule } from 'src/settings/settings.module';
import ToiHistory from 'src/db/models/toiHistory.model';
import ToiService from 'src/toi/toi.service';
import { RecordStatusController } from './record.status.controller';
import { RecordStatusService } from './record.status.service';
import HistoryUserService from './history.user.service';
import Toi from 'src/db/models/toi.model';
import Formular from 'src/db/models/Formular.model';
import { OmnicomModule } from 'src/omnicom/omnicom.module';
import OmnicomHistory from 'src/db/models/scoutHistory.model';
import { MeteoModule } from 'src/meteo/meteo.module';
import MeteoHistory from 'src/db/models/meteoHistory.model';
import { StandsModule } from 'src/stand-aodb/stand.aodb.module';
import StandsHistory from 'src/db/models/standsHistory.model';
import { AznbModule } from 'src/aznb/aznb.module';
import AznbHistory from 'src/db/models/aznbHistory.model';
import { SchedulerModule } from 'src/scheduler/scheduler.module';
import Settings from 'src/db/models/settings';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [HistoryUserService, RecordStatusService, ToiService],
  imports: [
    ApiConfigModule, PrismaModule, SettingsModule, MeteoModule, OmnicomModule, StandsModule, AznbModule, SchedulerModule,
    SequelizeModule.forFeature([Toi, Formular, ToiHistory, OmnicomHistory, MeteoHistory, StandsHistory, AznbHistory, Settings]),
  ],
  controllers: [RecordStatusController,],
  exports: [HistoryUserService, RecordStatusService,],
})
export class UserHistoryModule { }