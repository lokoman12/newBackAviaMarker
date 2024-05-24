import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import Photo from 'src/db/models/photo.model';
import { GetPhotoController } from './getPhoto.controller';

@Module({
  imports: [SequelizeModule.forFeature([Photo])],
  controllers: [GetPhotoController],
  exports: [SequelizeModule],
})
export class PhotoModule { }