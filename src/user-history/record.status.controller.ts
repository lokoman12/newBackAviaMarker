import {
  Body,
  Controller,
  Get,
  Logger,
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
import HistoryUserService from './history.user.service';
import { TimelineDto } from './types';
import dayjs from "../utils/dayjs";
import { HistoryErrorCodeEnum, HistoryBadStateException } from './user.bad.status.exception';
import { omit } from 'lodash';
import { SettingsService } from 'src/settings/settings.service';
import { ALREADY_EXISTS_HISTORY_RECORD_TABLE, AZNB_HISTORY_TABLE_NAME, METEO_HISTORY_TABLE_NAME, NO_FREE_HISTORY_RECORD_TABLE, OMNICOM_HISTORY_TABLE_NAME, STANDS_HISTORY_TABLE_NAME, TOI_HISTORY_TABLE_NAME } from 'src/history/consts';
import { ExternalScheduler } from 'src/scheduler/external.scheduler';
import { ToadScheduler, SimpleIntervalJob, AsyncTask } from 'toad-scheduler';
import { auth } from '@prisma/client';

@Controller('/record-status')
export class RecordStatusController {
  private readonly logger = new Logger(RecordStatusController.name);

  public static createHistoryJobName = 'CreateHistory';

  constructor(
    private readonly scheduler: ToadScheduler,
    private readonly externalScheduler: ExternalScheduler,
    private readonly recordStatusService: RecordStatusService,
    private readonly historyUserService: HistoryUserService,
  ) { }

  @Get("/test")
  async getTestResponse(
    @Req() req: Request
  ) {
    throw new HistoryBadStateException("", HistoryErrorCodeEnum.emptyHistoryResult, 'Какая-то ошибка для проверки ручки');
  }

  // @UseGuards(AccessTokenGuard)
  @Get("/get-tablenumber")
  async getTablenumber(
    @Query("username") username: string,
    @Req() req: Request
  ) {
    const value = await this.recordStatusService.getUserTablenumber(username);
    return value;
  }

  // @UseGuards(AccessTokenGuard)
  @Get("/set-tablenumber")
  async setTablenumber(
    @Query("username") username: string,
    // @Query("tablenumber", new ParseIntPipe) tablenumber: number,
    @Req() req: Request
  ) {
    const hasTablenumber = await this.recordStatusService.hasUserTablenumber(username);
    if (hasTablenumber) {
      return ALREADY_EXISTS_HISTORY_RECORD_TABLE;
    }

    const tablenumber = await this.historyUserService.getNextFreeTableNumberNew();
    this.logger.log(tablenumber);

    if (tablenumber > NO_FREE_HISTORY_RECORD_TABLE) {
      await this.recordStatusService.setTablenumber(username, tablenumber);
    }

    return tablenumber;
  }

  // @UseGuards(AccessTokenGuard)
  @Get("/reset-tablenumber")
  async resetTablenumber(
    @Query("username") username: string,
    @Req() req: Request
  ) {
    const hasTablenumber = await this.recordStatusService.hasUserTablenumber(username);
    if (hasTablenumber) {
      await this.recordStatusService.resetTablenumber(username);
      return true;
    }

    return false;
  }

  @UseGuards(AccessTokenGuard)
  @Get("/get-history-stages")
  async getHistoryStages(
    @Req() req: Request
  ) {
    const { username } = req.user as auth;
    this.logger.log(`/get-history-stages, username from token: ${username}`);

    const result = await this.recordStatusService.getRecordStatus(username);
    return result !== null ? {
      historyGenerateStages: result.historyGenerateStages,
    } : {};
  }

  @UseGuards(AccessTokenGuard)
  @Get("/get")
  async getRecordStatus(
    // @Query("username") username?: string,
    @Req() req: Request
  ) {
    const { username } = req.user as auth;
    this.logger.log(`/get, username from token: ${username}`);

    const result = await this.recordStatusService.getRecordStatus(username);
    return result !== null ? {
      ...omit(result, ['logger']),
      startTime: result.startTime.getTime(),
      endTime: result.endTime.getTime(),
      currentTime: result.currentTime.getTime(),
    } : null;
  }

  // @UseGuards(AccessTokenGuard)
  @Get("/set-new")
  async setRecordStatusNew(
    @Query("username") username: string,
    @Query("timeStart", new ParseDatePipe(true)) timeStart: Date,
    @Query("timeEnd", new ParseDatePipe(true)) timeEnd: Date,
    @Query("velocity", new ParseIntPipe) velocity: number,
    @Req() req: Request
  ) {
    // const { username } = req.user as User;
    // this.logger.log(`/set, username from token: ${username}`);
    this.logger.log(`/set, request: ${username} ${timeStart}, ${timeEnd}, ${velocity}`);


    const hasTablenumber = await this.recordStatusService.hasUserTablenumber(username);
    if (hasTablenumber) {
      return ALREADY_EXISTS_HISTORY_RECORD_TABLE;
    }

    const tablenumber = await this.historyUserService.getNextFreeTableNumberNew();
    this.logger.log(tablenumber);

    if (tablenumber > NO_FREE_HISTORY_RECORD_TABLE) {
      await this.recordStatusService.setTablenumber(username, tablenumber);
    } else {
      return NO_FREE_HISTORY_RECORD_TABLE;
    }


    if (this.externalScheduler.isJobExistsByName(RecordStatusController.createHistoryJobName)) {
      this.externalScheduler.cancelJobByName(RecordStatusController.createHistoryJobName);
    }

    // Если задача была запущена, остановим
    if (this.scheduler.existsById(RecordStatusController.createHistoryJobName)) {
      this.logger.log('Check existing task');
      this.scheduler.removeById(RecordStatusController.createHistoryJobName);
    }
    const task = new AsyncTask(
      RecordStatusController.createHistoryJobName,
      () => {
        this.logger.log(`Start job for user ${username}, start time: ${new Date()}`);
        const time = new Date().getTime();

        return this.historyUserService.tryFillInUserHistoryTable(username, tablenumber, timeStart, timeEnd, velocity)
          .then(() => {
            this.logger.log(`Stop job for user ${username}, end date: ${new Date()}, time spent: ${new Date().getTime() / time * 1000} seconds`);
            // Завершим задачу после однократного исполнения
            if (this.scheduler.existsById(RecordStatusController.createHistoryJobName)) {
              this.logger.log(`Stopped job for user ${username}`);
              this.scheduler.removeById(RecordStatusController.createHistoryJobName);
            }
          });
      },
      (err: Error) => {
        this.logger.error(`Can not finish tryFillInUserHistoryTable for user ${username}, error: ${err}`);
      }
    );
    // Интервал выполнения - 1 час. Через час задача снимется системой по таймауту
    const job = new SimpleIntervalJob({ hours: 1, runImmediately: true, }, task);
    this.scheduler.addSimpleIntervalJob(job);

    return tablenumber;
  }

  // @UseGuards(AccessTokenGuard)
  // @Get("/set")
  // async setRecordStatus(
  //   @Query("timeStart", new ParseDatePipe(true)) timeStart: Date,
  //   @Query("timeEnd", new ParseDatePipe(true)) timeEnd: Date,
  //   @Query("velocity", new ParseIntPipe) velocity: number,
  //   @Req() req: Request
  // ) {
  //   const { username } = req.user as User;
  //   this.logger.log(`/set, username from token: ${username}`);
  //   this.logger.log(`/set, request: ${timeStart}, ${timeEnd}, ${velocity}`);

  //   if (this.externalScheduler.isJobExistsByName(RecordStatusController.createHistoryJobName)) {
  //     this.externalScheduler.cancelJobByName(RecordStatusController.createHistoryJobName);
  //   }

  //   // Если задача была запущена, остановим
  //   if (this.scheduler.existsById(RecordStatusController.createHistoryJobName)) {
  //     this.logger.log('Check existing task');
  //     this.scheduler.removeById(RecordStatusController.createHistoryJobName);
  //   }
  //   const task = new AsyncTask(
  //     RecordStatusController.createHistoryJobName,
  //     () => {
  //       // return new Promise<void>((resolve) => {

  //       // resolve();
  //       // });
  //       this.logger.log(`Start job for user ${username}`);
  //       return this.historyUserService.tryFillInUserHistoryTable(username, timeStart, timeEnd, velocity)
  //         .then(() => {
  //           this.logger.log(`Stop job for user ${username}`);
  //           // Завершим задачу после однократного исполнения
  //           if (this.scheduler.existsById(RecordStatusController.createHistoryJobName)) {
  //             this.logger.log(`Stopped job for user ${username}`);
  //             this.scheduler.removeById(RecordStatusController.createHistoryJobName);
  //           }
  //         });
  //     },
  //     (err: Error) => {
  //       this.logger.error(`Can not finish tryFillInUserHistoryTable for user ${username}, error: ${err}`);
  //     }
  //   );
  //   // Интервал выполнения - 1 час. Через час задача снимется системой по таймауту
  //   const job = new SimpleIntervalJob({ hours: 1, runImmediately: true, }, task);
  //   this.scheduler.addSimpleIntervalJob(job);

  //   return {
  //     // ...result,
  //     // startTime: result.startTime.getTime(),
  //     // endTime: result.endTime.getTime(),
  //     // currentTime: result.currentTime.getTime(),
  //   };
  // }

  @UseGuards(AccessTokenGuard)
  @Get("/move-current")
  async setCurrent(
    @Query("stepsCount") stepsCount: number,
    @Req() req: Request
  ) {
    const { username } = req.user as auth;
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
          toiCurrent.currentId,
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
  @Get("/set-current-by-step-id")
  async setCurrentByStepId(
    @Body() timelineDto: TimelineDto,
    @Req() req: Request
  ) {

  }

  @UseGuards(AccessTokenGuard)
  @Post("/set-current")
  async setCurrentByPost(
    @Body() timelineDto: TimelineDto,
    @Req() req: Request
  ) {
    const { username } = req.user as auth;
    this.logger.log(`POST /set-current, username from token: ${username}, body: ${JSON.stringify(timelineDto)}`);

    let currentTimeDayjs = dayjs.utc(timelineDto.currentTime);
    if (!currentTimeDayjs.isValid()) {
      throw new HistoryBadStateException(username, HistoryErrorCodeEnum.invalidDateValue, 'Задайте корректное значение для currentTime!');
    }

    const result = await this.recordStatusService.setCurrent(
      username,
      timelineDto.currentToiId,
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
    const { username } = req.user as auth;
    this.logger.log(`/reset, username from token: ${username}`);
    await this.recordStatusService.resetRecordStatus(username);

    const hasTablenumber = await this.recordStatusService.hasUserTablenumber(username);
    if (hasTablenumber) {
      await this.recordStatusService.resetTablenumber(username);
      return true;
    }

    return;
  }
}
