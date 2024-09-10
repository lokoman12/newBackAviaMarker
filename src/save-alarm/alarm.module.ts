import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SaveAlarmController } from './save.alarm.controller';
import AlaramAM from 'src/db/models/alarm.model';




@Module({
  imports: [SequelizeModule.forFeature([AlaramAM])],
  controllers: [SaveAlarmController],
  exports: [SequelizeModule],
})
export class SaveAlaramModule implements NestModule {
  private readonly logger = new Logger(SaveAlaramModule.name);

  configure(consumer: MiddlewareConsumer) {
    this.logger.debug('Init SaveAlaramModule');
  }
}