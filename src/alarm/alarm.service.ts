import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import AlaramAM from 'src/db/models/alarm.model';

@Injectable()
export default class AlarmService {
  private readonly logger = new Logger(AlarmService.name);

  constructor(
    @InjectModel(AlaramAM) private readonly alarmModel: typeof AlaramAM,
  ) {
    this.logger.log('Init service');
  }

  async getActualData(): Promise<Array<AlaramAM>> {
    try {
      const alarms = await this.alarmModel.findAll();
      return alarms;
    } catch (error) {
      console.error('Error retrieving alarms:', error);
      throw error;
    }
  }

}
