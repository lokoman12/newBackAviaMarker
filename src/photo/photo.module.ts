import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import Photo from 'src/db/models/photo.model';
import { GetPhotoController } from './getPhoto.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

// Нет для шарика
@Module({
  imports: [PrismaModule, SequelizeModule.forFeature([Photo])],
  controllers: [GetPhotoController],
  exports: [SequelizeModule],
})
export class PhotoModule implements NestModule {
  private readonly logger = new Logger(PhotoModule.name);

  configure(consumer: MiddlewareConsumer) {
    this.logger.debug('Init PhotoModule');
  }
}