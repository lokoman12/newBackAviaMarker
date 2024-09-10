import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import PositionAM from 'src/db/models/position.model';
import { PositionController } from './position.controller';
import PositionService from './position.service';




@Module({
  imports: [SequelizeModule.forFeature([PositionAM])],
  providers: [PositionService],
  controllers: [PositionController],
  exports: [PositionService, SequelizeModule],
})
export class PositionModule implements NestModule {
  private readonly logger = new Logger(PositionModule.name);

  configure(consumer: MiddlewareConsumer) {
    this.logger.debug('Init PositionModule');
  }
}