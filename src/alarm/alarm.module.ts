import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import AlaramAM from 'src/db/models/alarm.model';
import { AlarmController } from './alarm.controller';
import AlarmService from './alarm.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule,],
  providers: [AlarmService,],
  controllers: [AlarmController],
  exports: [AlarmService,],
})
export class AlarmModule implements NestModule {
  private readonly logger = new Logger(AlarmModule.name);

  configure(consumer: MiddlewareConsumer) {
    this.logger.debug('Init AlarmModule');
  }
}