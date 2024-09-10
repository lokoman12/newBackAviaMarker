import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SaveZoneController } from './save.zone.controller';
import ZoneAM from 'src/db/models/zone.model';


@Module({
  imports: [SequelizeModule.forFeature([ZoneAM])],
  controllers: [SaveZoneController],
  exports: [SequelizeModule],
})
export class SaveZoneModule implements NestModule {
  private readonly logger = new Logger(SaveZoneModule.name);

  configure(consumer: MiddlewareConsumer) {
    this.logger.debug('Init SaveZoneModule');
  }
}