import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LineController } from './line.controller';
import Line from 'src/db/models/line.model';
import Photo from 'src/db/models/photo.model';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LineService } from './line.service';

// Нет для шарика
@Module({
  imports: [PrismaModule, SequelizeModule.forFeature([Line, Photo])],
  providers: [LineService,],
  controllers: [LineController,],
  exports: [SequelizeModule],
})
export class LineModule implements NestModule {
  private readonly logger = new Logger(LineModule.name);

  configure(consumer: MiddlewareConsumer) {
    this.logger.debug('Init LineModule');
  }
}