import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import AlaramAM from 'src/db/models/alarm.model';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export default class AlarmService {
  private readonly logger = new Logger(AlarmService.name);

  constructor(
    private readonly prismaService: PrismaService,
    @InjectModel(AlaramAM) private readonly alarmModel: typeof AlaramAM,
  ) {
    this.logger.log('Init service');
  }

  async getActualData(): Promise<Array<AlaramAM>> {
    try {
      const alarms = await this.alarmModel.findAll({raw: true});
      return alarms;
    } catch (error) {
      this.logger.error('Error retrieving alarms:', error);
      // throw error;
      return [];
    }
  }

}
