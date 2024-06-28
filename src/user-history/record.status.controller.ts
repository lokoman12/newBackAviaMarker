import {
  Controller,
  Get,
  Logger,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ParseDatePipe } from 'src/pipes/parseDatePipe';
import { RecordStatusService } from './record.status.service';
import { AccessTokenGuard } from 'src/auth/guards/access.token.guard';
import User from 'src/db/models/user';
import HistoryUserService from './history.user.service';

@Controller('record-status')
export class RecordStatusController {
  private readonly logger = new Logger(RecordStatusController.name);

  constructor(
    private readonly recordStatusService: RecordStatusService,
    private readonly historyUserService: HistoryUserService,
  ) { }

  @UseGuards(AccessTokenGuard)
  @Get("/get")
  async getRecordStatus(
    @Req() req: Request
  ) {
    const { username } = req.user as User;
    this.logger.log(`/get, username from token: ${username}`);

    const result = await this.recordStatusService.getRecordStatus(username);
    return result;
  }

  @UseGuards(AccessTokenGuard)
  @Get("/set")
  async setRecordStatus(
    @Query("timeStart", new ParseDatePipe(true)) timeStart: Date,
    @Query("timeEnd", new ParseDatePipe(true)) timeEnd: Date,
    @Query("velocity", new ParseIntPipe) velocity: number,
    @Req() req: Request
  ) {
    const { username } = req.user as User;
    this.logger.log(`/set, username from token: ${username}`);
    this.logger.log(`/set, request: ${timeStart}, ${timeEnd}, ${velocity}`);
    const result = await this.historyUserService.tryFillInUserHistoryTable(username, timeStart, timeEnd, velocity);
    this.logger.log(`/set, request: ${timeStart}, ${timeEnd}, ${velocity}`);

    return result;
  }

  @UseGuards(AccessTokenGuard)
  @Get("/reset")
  async resetRecordStatus(
    @Req() req: Request
  ) {
    const { username } = req.user as User;
    this.logger.log(`/reset, username from token: ${username}`);
    await this.recordStatusService.resetRecordStatus(username);
    return;
  }
}
