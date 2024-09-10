import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ZoneController } from './zone.controller';
import ZoneAM from 'src/db/models/zone.model';




@Module({
  imports: [SequelizeModule.forFeature([ZoneAM])],
  controllers: [ZoneController],
  exports: [SequelizeModule],
})
export class ZoneModule implements NestModule {
  private readonly logger = new Logger(ZoneModule.name);

  configure(consumer: MiddlewareConsumer) {
    this.logger.debug('Init ZoneModule');
  }
}