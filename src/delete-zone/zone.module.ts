import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import ZoneAM from 'src/db/models/zone.model';
import { ZoneController } from 'src/zone/zone.controller';
import { DeleteZoneController } from './delete.zone.controller';




@Module({
  imports: [SequelizeModule.forFeature([ZoneAM])],
  controllers: [DeleteZoneController],
  exports: [SequelizeModule],
})
export class DeleteZoneModule implements NestModule {
  private readonly logger = new Logger(DeleteZoneModule.name);

  configure(consumer: MiddlewareConsumer) {
    this.logger.debug('Init DeleteZoneModule');
  }
}