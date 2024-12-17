import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { alarmAM } from '@prisma/client';

@Injectable()
export default class AlarmService {
  private readonly logger = new Logger(AlarmService.name);

  constructor(
    private readonly prismaService: PrismaService,
  ) {
    this.logger.log('Init service');
  }

  async getActualData(): Promise<Array<alarmAM>> {
    try {
      const alarms = await this.prismaService.alarmAM.findMany();
      return alarms;
    } catch (error) {
      this.logger.error('Error retrieving alarms:', error);
      throw error;
    }
  }

}
