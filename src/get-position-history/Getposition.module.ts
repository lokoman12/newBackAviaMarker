import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PositionHistoryController } from './Getposition.controller';
import PositionHistory from 'src/db/models/positionHistory.model';



@Module({
  imports: [SequelizeModule.forFeature([PositionHistory])],
  controllers: [PositionHistoryController],
  exports: [SequelizeModule],
})
export class GetpositionModule {}