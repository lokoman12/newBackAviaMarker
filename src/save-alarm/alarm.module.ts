import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SaveAlarmController } from './save.alarm.controller';
import AlaramAM from 'src/db/models/alarm.model';




@Module({
  imports: [SequelizeModule.forFeature([AlaramAM])],
  controllers: [SaveAlarmController],
  exports: [SequelizeModule],
})
export class SaveAlaramModule {}