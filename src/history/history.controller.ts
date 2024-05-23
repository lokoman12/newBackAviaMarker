import {
  Controller,
  Get,
  Logger,
  NotAcceptableException,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ParseDatePipe } from 'src/pipes/parseDatePipe';
import ToiHistory from 'src/db/models/toiHistory.model';
import { Op } from 'sequelize';
import { RecordStatusService } from './record.status.service';
import { AccessTokenGuard } from 'src/auth/guards/access.token.guard';
import User from 'src/db/models/user';
import { SettingsService } from 'src/settings/settings.service';
import { ApiConfigService } from 'src/config/api.config.service';
import TimelineService from './timelineService';

@Controller('history')
export class HistoryController {
  private readonly logger = new Logger(HistoryController.name);

  constructor(
    private recordStatusService: RecordStatusService,
    private timelineService: TimelineService
  ) { }

  @Get('/')
  async getFormular(
    @Query("timeStart", new ParseDatePipe(true)) timeStart: Date,
    @Query("timeEnd", new ParseDatePipe(true)) timeEnd: Date,
  ) {
    const result = await ToiHistory.findAll({
      raw: true,
      where: {
        time: {
          [Op.and]: {
            [Op.gte]: timeStart,
            [Op.lte]: timeEnd,
          }
        },
      },
    });

    return result;
  }

  @Get('/get-recorded-formular')
  async getCurrentFormularFromRecord(
    @Req() req: Request
  ) {
    const { username } = req.user as User;
    const result = this.timelineService.getCurrentFormularFromRecord(username);
    return result;
  }

  @UseGuards(AccessTokenGuard)
  @Get("/set-record")
  async setRecordStatus(
    @Query("timeStart", new ParseDatePipe(true)) timeStart: Date,
    @Query("timeEnd", new ParseDatePipe(true)) timeEnd: Date,
    @Query("velocity", new ParseIntPipe) velocity: number,
    @Req() req: Request
  ) {
    const { username } = req.user as User;
    this.logger.log(`Username from token: ${username}`);
    const result = await this.timelineService.tryFillInUserHistoryTable(username, timeStart, timeEnd, velocity);
    return result;
  }

  @UseGuards(AccessTokenGuard)
  @Get("/reset-record")
  async resetRecordStatus(
    @Req() req: Request
  ) {
    const { username } = req.user as User;
    this.logger.log(`Username from token: ${username}`);
    await this.recordStatusService.resetRecordStatus(username);
    return;
  }
}
