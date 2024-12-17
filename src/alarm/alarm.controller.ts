import { Controller, Get, UseGuards } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/access.token.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { alarmAM } from '@prisma/client';
import AlarmService from './alarm.service';

@Controller('/alarm')
export class AlarmController {
  private readonly logger = new Logger(AlarmController.name);

  constructor(
    private readonly alarmService:  AlarmService
  ) {
    this.logger.log('Init controller');
  }

  @Public()
  // @UseGuards(AccessTokenGuard)
  @Get()
  async getAllAlram(): Promise<Array<alarmAM>> {
    try {
     const alarms = await this.alarmService.getActualData();
      return alarms;
    } catch (error) {
      this.logger.error('Error retrieving alarms:', error);
      throw error;
    }
  }
}