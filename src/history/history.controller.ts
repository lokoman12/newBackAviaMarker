import {
  Controller,
  Get,
  Logger,
  ParseIntPipe,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { Request, Response } from 'express';
import HistoryService from './historyService';
import ToiCopyToHistoryScheduler from './toi.copy.history.scheduler';
import { ParseDatePipe } from 'src/pipes/parseDatePipe';
import ToiHistory from 'src/db/models/toiHistory.model';
import { Op } from 'sequelize';
import dayjs from '../utils/dayjs';
import { RecordStatusService } from './record.status.service';
import { AccessTokenGuard } from 'src/auth/guards/access.token.guard';
import User from 'src/db/models/user';

@Controller('history')
export class HistoryController {
  private readonly logger = new Logger(HistoryController.name);

  constructor(
    private historyService: HistoryService,
    private scheduler: ToiCopyToHistoryScheduler,
    private recordStatusService: RecordStatusService
  ) { }

  @Public()
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

  // @UseGuards(AccessTokenGuard)
  @Get("/set-record")
  async setRecordStatus(
    @Query("timeStart", new ParseDatePipe(true)) timeStart: Date,
    @Query("timeEnd", new ParseDatePipe(true)) timeEnd: Date,
    @Query("velocity", new ParseIntPipe) velocity: number,
    @Req() req: Request
  ) {
    const { username } = req.user as User;
    this.logger.log(`Username from token: ${username}`);
    const result = await this.recordStatusService.tryFillInUserHistoryTable(username, timeStart, timeEnd, velocity);
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
