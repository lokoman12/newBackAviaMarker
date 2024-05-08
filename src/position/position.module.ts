import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import PositionAM from 'src/db/models/position.model';
import { PositionController } from './getPosition.controller';




@Module({
  imports: [SequelizeModule.forFeature([PositionAM])],
  controllers: [PositionController],
  exports: [SequelizeModule],
})
export class PositionModule {}