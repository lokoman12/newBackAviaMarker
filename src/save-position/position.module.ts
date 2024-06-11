import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import PositionAM from 'src/db/models/position.model';
import { SavePositionController } from './save.position.controller';
import PositionHistory from 'src/db/models/positionHistory.model';




@Module({
  imports: [SequelizeModule.forFeature([PositionAM, PositionHistory])],
  controllers: [SavePositionController],
  exports: [SequelizeModule],
})
export class SavePositionModule {}