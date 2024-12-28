import { Controller, Post, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import AlaramAM from 'src/db/models/alarm.model';
import { AccessTokenGuard } from '../auth/guards/access.token.guard';
import { UseGuards } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';


@Controller('/saveAlarm')
export class SaveAlarmController {
  private readonly logger = new Logger(SaveAlarmController.name);

  constructor(
    @InjectModel(AlaramAM) private readonly alarmModel: typeof AlaramAM,
  ) {
    // this.logger.log('Init controller');
  }
  
  @Public()
  // @UseGuards(AccessTokenGuard)
  @Post()
  async saveAlarm(
    @Query('lat') lat: number,
    @Query('lon') lon: number,
    @Query('speed') speed: number,
    @Query('name') name: string,
    @Query('typeViolation') typeViolation: string,
  ): Promise<any> {
    try {
      const time = new Date();
      const saveAlarm = await this.alarmModel.create({
        lat: lat,
        lon: lon,
        speed: speed,
        name: name,
        typeViolation: typeViolation,
        time: time,
      });
      return saveAlarm;
    } catch (error) {
      this.logger.error('Error saving alarm:', error);
      throw error;
    }
  }
}
