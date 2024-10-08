import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LineController } from './line.controller';
import { SaveLineController } from './saveLine.controller';
import Line from 'src/db/models/line.model';
import Photo from 'src/db/models/photo.model';

@Module({
  imports: [SequelizeModule.forFeature([Line, Photo])],
  controllers: [LineController, SaveLineController],
  exports: [SequelizeModule],
})
export class LineModule implements NestModule {
  private readonly logger = new Logger(LineModule.name);

  configure(consumer: MiddlewareConsumer) {
    this.logger.debug('Init LineModule');
  }
}