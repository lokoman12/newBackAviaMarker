import { Controller, Post, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import AlaramAM from 'src/db/models/alarm.model';

@Controller('saveAlarm')
export class SaveAlarmController {
  private readonly log = new Logger(SaveAlarmController.name);

  constructor(
    @InjectModel(AlaramAM) private readonly alarmModel: typeof AlaramAM,
  ) {
    this.log.log('Init controller');
  }
  @Post()
  async saveAlarm(
    @Query('lat') lat: number,
    @Query('lon') lon: number,
    @Query('name') name: string,
  ): Promise<any> {
    try {
      const time = new Date();
      const saveAlarm = await this.alarmModel.create({
        lat: lat,
        lon: lon,
        name: name,
        time: time,
      });
      return saveAlarm;
    } catch (error) {
      this.log.error('Error saving alarm:', error);
      throw error;
    }
  }
}
