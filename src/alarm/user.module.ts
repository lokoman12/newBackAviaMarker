import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AlaramAM } from 'src/db/models/alarm.model';
import { AlarmController } from './alarm.controller';




@Module({
  imports: [SequelizeModule.forFeature([AlaramAM])],
  controllers: [AlarmController],
  exports: [SequelizeModule],
})
export class AlarmModule {}