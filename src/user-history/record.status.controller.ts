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
import { SettingsService } from 'src/settings/settings.service';
import { AZNB_HISTORY_TABLE_NAME, METEO_HISTORY_TABLE_NAME, OMNICOM_HISTORY_TABLE_NAME, STANDS_HISTORY_TABLE_NAME, TOI_HISTORY_TABLE_NAME } from 'src/history/consts';

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
      let newCurrentStep = recordStatus.currentToiId + stepsCount;

      // Листаем вперёд или назад, проверяем границы таймлайна
      if (stepsCount > 0) {
        if (recordStatus.endToiId < newCurrentStep) {
          newCurrentStep = recordStatus.endToiId;
        }
      } else {
        if (recordStatus.startToiId > newCurrentStep) {
          newCurrentStep = recordStatus.startToiId;
        }
      }

      const toiTableName = SettingsService.getRecordTableNameByIndex(TOI_HISTORY_TABLE_NAME, recordStatus.tableNumber);
      const toiCurrent = await this.historyUserService.getTimeByStep(toiTableName, stepsCount);

      const omnicomTableName = SettingsService.getRecordTableNameByIndex(OMNICOM_HISTORY_TABLE_NAME, recordStatus.tableNumber);
      const omnicomCurrent = await this.historyUserService.getTimeByStep(omnicomTableName, stepsCount);

      const meteoTableName = SettingsService.getRecordTableNameByIndex(METEO_HISTORY_TABLE_NAME, recordStatus.tableNumber);
      const meteoCurrent = await this.historyUserService.getTimeByStep(meteoTableName, stepsCount);

      const standsTableName = SettingsService.getRecordTableNameByIndex(STANDS_HISTORY_TABLE_NAME, recordStatus.tableNumber);
      const standsCurrent = await this.historyUserService.getTimeByStep(standsTableName, stepsCount);

      const aznbTableName = SettingsService.getRecordTableNameByIndex(AZNB_HISTORY_TABLE_NAME, recordStatus.tableNumber);
      const aznbCurrent = await this.historyUserService.getTimeByStep(aznbTableName, stepsCount);

      if (toiCurrent) {
        const toiHistoryResult = await this.recordStatusService.setCurrent(
          username,
          toiCurrent.currentId, omnicomCurrent.currentId, meteoCurrent.currentId, standsCurrent.currentId, aznbCurrent.currentId,
          dayjs.utc(toiCurrent.currentTime).toDate()
        );

        // this.logger.log(`current.currentTime: ${current.currentTime}, str: ${dayjs.utc(current.currentTime).toDate()}`);
        return toiHistoryResult !== null ? {
          ...toiHistoryResult,
          startTime: toiHistoryResult.startTime.getTime(),
          endTime: toiHistoryResult.endTime.getTime(),
          currentTime: toiHistoryResult.currentTime.getTime(),
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
    this.logger.log(`POST /set-current, username from token: ${username}, body: ${JSON.stringify(timelineDto)}`);

    let currentTimeDayjs = dayjs.utc(timelineDto.currentTime);
    if (!currentTimeDayjs.isValid()) {
      throw new HistoryBadStateException(username, HistoryErrorCodeEnum.invalidDateValue, 'Задайте корректное значение для currentTime!');
    }

    const result = await this.recordStatusService.setCurrent(
      username,
      timelineDto.currentToiId, timelineDto.currentOmnicomId, timelineDto.currentMeteoId, timelineDto.currentStandsId, timelineDto.currentAznbId,
      currentTimeDayjs.toDate()
    );
    return result !== null ? {
      ...omit(result, ['logger']),
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
