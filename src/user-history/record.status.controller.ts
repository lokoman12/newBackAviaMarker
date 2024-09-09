import {
  Body,
  Controller,
  Get,
  Logger,
  NotAcceptableException,
  ParseIntPipe,
  Post,
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
import { TimelineDto } from './types';
import dayjs from "../utils/dayjs";
import { HistoryErrorCodeEnum, HistoryBadStateException } from './user.bad.status.exception';
import { omit } from 'lodash';

@Controller('/record-status')
export class RecordStatusController {
  private readonly logger = new Logger(RecordStatusController.name);

  constructor(
    private readonly recordStatusService: RecordStatusService,
    private readonly historyUserService: HistoryUserService,
  ) { }

  @Get("/test")
  async getTestResponse(
    @Req() req: Request
  ) {
    throw new HistoryBadStateException("", HistoryErrorCodeEnum.emptyHistoryResult, 'Какая-то ошибка для проверки ручки');
  }

  @UseGuards(AccessTokenGuard)
  @Get("/get")
  async getRecordStatus(
    @Req() req: Request
  ) {
    const { username } = req.user as User;
    this.logger.log(`/get, username from token: ${username}`);

    const result = await this.recordStatusService.getRecordStatus(username);
    return result !== null ? {
      ...omit(result, ['logger']),
      startTime: result.startTime.getTime(),
      endTime: result.endTime.getTime(),
      currentTime: result.currentTime.getTime(),
    } : null;
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

    return {
      ...result,
      startTime: result.startTime.getTime(),
      endTime: result.endTime.getTime(),
      currentTime: result.currentTime.getTime(),
    };
  }

  @UseGuards(AccessTokenGuard)
  @Get("/move-current")
  async setCurrent(
    @Query("stepsCount") stepsCount: number,
    @Req() req: Request
  ) {
    const { username } = req.user as User;
    this.logger.log(`GET /move-current, username from token: ${username}, stepsCount: ${stepsCount}`);
    // this.logger.log(`GET /move-current, username from token: ${username}, stepsCount: ${stepsCount}`);

    const recordStatus = await this.recordStatusService.getRecordStatus(username);
    if (recordStatus) {
      let newCurrentStep = recordStatus.currentId + stepsCount;

      // Листаем вперёд или назад, проверяем границы таймлайна
      if (stepsCount > 0) {
        if (recordStatus.endId < newCurrentStep) {
          newCurrentStep = recordStatus.endId;
        }
      } else {
        if (recordStatus.startId > newCurrentStep) {
          newCurrentStep = recordStatus.startId;
        }
      }

      const current = await this.historyUserService.getTimeByStep(recordStatus.tableNumber, stepsCount);
      if (current) {
        const result = await this.recordStatusService.setCurrent(
          username,
          current.currentId, dayjs.utc(current.currentTime).toDate()
        );

        // this.logger.log(`current.currentTime: ${current.currentTime}, str: ${dayjs.utc(current.currentTime).toDate()}`);
        return result !== null ? {
          ...result,
          startTime: result.startTime.getTime(),
          endTime: result.endTime.getTime(),
          currentTime: result.currentTime.getTime(),
        } : null;
      }

      return null;
    }
  }

  @UseGuards(AccessTokenGuard)
  @Post("/set-current")
  async setCurrentByPost(
    @Body() timelineDto: TimelineDto,
    @Req() req: Request
  ) {
    const { username } = req.user as User;
    this.logger.log(`POST /set-current, username from token: ${username}, body: ${timelineDto}`);

    let currentTimeDayjs = dayjs.utc(timelineDto.currentTime);
    if (!currentTimeDayjs.isValid()) {
      throw new HistoryBadStateException(username, HistoryErrorCodeEnum.invalidDateValue, 'Задайте корректное значение для currentTime!');
    }

    const result = await this.recordStatusService.setCurrent(username, timelineDto.currentId, currentTimeDayjs.toDate());
    return result !== null ? {
      ...result,
      startTime: result.startTime.getTime(),
      endTime: result.endTime.getTime(),
      currentTime: result.currentTime.getTime(),
    } : null;
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
