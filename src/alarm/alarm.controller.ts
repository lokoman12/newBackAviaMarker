import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import AlaramAM from 'src/db/models/alarm.model';
import { AccessTokenGuard } from 'src/auth/guards/access.token.guard';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('/alarm')
export class AlarmController {
  private readonly logger = new Logger(AlarmController.name);

  constructor(
    @InjectModel(AlaramAM) private readonly alarmModel: typeof AlaramAM,
  ) {
    this.logger.log('Init controller');
  }

  @Public()
  // @UseGuards(AccessTokenGuard)
  @Get()
  async getAllAlram(): Promise<Array<AlaramAM>> {
    try {
      const alarms = await this.alarmModel.findAll();
      return alarms;
    } catch (error) {
      this.logger.error('Error retrieving alarms:', error);
      throw error;
    }
  }
}