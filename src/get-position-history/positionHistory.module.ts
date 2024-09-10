import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PositionHistoryController } from './positionHistory.controller';
import PositionHistory from 'src/db/models/positionHistory.model';



@Module({
  imports: [SequelizeModule.forFeature([PositionHistory])],
  controllers: [PositionHistoryController],
  exports: [SequelizeModule],
})
export class PositionHistoryModule implements NestModule {
  private readonly logger = new Logger(PositionHistoryModule.name);

  configure(consumer: MiddlewareConsumer) {
    this.logger.debug('Init PositionHistoryModule');
  }
}