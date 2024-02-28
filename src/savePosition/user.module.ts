import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PositionAM } from 'src/db/models/position.model';
import { SavePositionController } from './savePosition.controller';




@Module({
  imports: [SequelizeModule.forFeature([PositionAM])],
  controllers: [SavePositionController],
  exports: [SequelizeModule],
})
export class SavePositionModule {}