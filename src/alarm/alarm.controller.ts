import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import { AlaramAM } from 'src/db/models/alarm.model';

@Controller('alarm')
export class AlarmController {
  private readonly log = new Logger(AlarmController.name);

  constructor(
    @InjectModel(AlaramAM) private readonly alarmModel: typeof AlaramAM,
  ) {
    this.log.log('Init controller');
  }

  @Get()
  async getAllAlram(): Promise<AlaramAM[]> {
    try {
      const alarm = await this.alarmModel.findAll();
      return alarm;
    } catch (error) {
      console.error('Error retrieving alarm:', error);
      throw error;
    }
  }
}