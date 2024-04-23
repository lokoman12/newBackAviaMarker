import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import AlaramAM from 'src/db/models/alarm.model';
import { Public } from 'src/auth/consts';

@Controller('alarm')
export class AlarmController {
  private readonly log = new Logger(AlarmController.name);

  constructor(
    @InjectModel(AlaramAM) private readonly alarmModel: typeof AlaramAM,
  ) {
    this.log.log('Init controller');
  }

  @Public()
  @Get()
  async getAllAlram(): Promise<AlaramAM[]> {
    try {
      const alarm = await this.alarmModel.findAll();
      return alarm;
    } catch (error) {
      this.log.error('Error retrieving alarm:', error);
      throw error;
    }
  }
}