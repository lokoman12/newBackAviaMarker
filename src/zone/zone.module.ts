import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ZoneController } from './zone.controller';
import ZoneAM from 'src/db/models/zone.model';
import { DeleteZoneController } from './delete.zone.controller';
import { SaveZoneController } from './save.zone.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

// Нет для шарика
@Module({
  imports: [PrismaModule, SequelizeModule.forFeature([ZoneAM])],
  controllers: [ZoneController, DeleteZoneController, SaveZoneController, ],
  exports: [SequelizeModule],
})
export class ZoneModule implements NestModule {
  private readonly logger = new Logger(ZoneModule.name);

  configure(consumer: MiddlewareConsumer) {
    this.logger.debug('Init ZoneModule');
  }
}