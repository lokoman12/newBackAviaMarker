import {
  Controller,
  Get,
  Logger,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/auth/guards/access.token.guard';
import User from 'src/db/models/user';
import ToiHistoryService from './toi.history.service';
import { HistoryArrayOfLists, HistoryResponsePackType, HistoryResponseType } from './types';
import { InjectConnection } from '@nestjs/sequelize';
import { QueryTypes, Sequelize } from 'sequelize';
import { RecordStatusService } from 'src/user-history/record.status.service';
import OmnicomHistoryService from './omnicom.history.service';

@Controller('/history')
export class HistoryController {
  private readonly logger = new Logger(HistoryController.name);

  constructor(
    @InjectConnection()
    private readonly sequelize: Sequelize,
    private readonly toiHistoryService: ToiHistoryService,
    private readonly omnicomHistoryService: OmnicomHistoryService,
    private readonly recordStatusService: RecordStatusService
  ) { }


  // @UseGuards(AccessTokenGuard)
  @Get("/test-custom-toi-history")
  async getCustomToiSql(
    @Req() req: Request
  ): Promise<Array<any>> {
    // const { username } = req.user as User;
    this.logger.log(`/test-custom-toi-history`);
    const result = await this.sequelize.query(
      `select id, time from toi_history limit 10`,
      { raw: true, type: QueryTypes.SELECT, }
    )
    return result;
  }

  @UseGuards(AccessTokenGuard)
  @Get("/toi-from-history")
  async getAllToi(
    @Req() req: Request
  ): Promise<HistoryResponseType> {
    const { username } = req.user as User;
    // this.logger.log(`Username from token: ${username}`);
    const result = await this.toiHistoryService.getCurrentHistory(username);
    return result;
  }

  @UseGuards(AccessTokenGuard)
  @Get("/omnicom-from-history")
  async getAllOmnicom(
    @Req() req: Request
  ): Promise<HistoryResponseType> {
    const { username } = req.user as User;
    // this.logger.log(`Username from token: ${username}`);
    const result = await this.toiHistoryService.getCurrentHistory(username);
    return result;
  }

  @Get("/test-omnicom-history-pack")
  async getOmnicomHistoryByPack(
    @Query('username') username: string,
    @Req() req: Request
  ): Promise<HistoryResponsePackType> {
    const status = await this.recordStatusService.getRecordStatus(username);
    // this.logger.log(`Username from token: ${username}`);
    const result = await this.omnicomHistoryService.getCurrentHistoryPack(username);
    return result;
  }
  
  @Get("/test-toi-history-pack")
  async getToiHistoryByPack(
    @Query('username') username: string,
    @Req() req: Request
  ): Promise<HistoryResponsePackType> {
    const status = await this.recordStatusService.getRecordStatus(username);
    // this.logger.log(`Username from token: ${username}`);
    const result = await this.toiHistoryService.getCurrentHistoryPack(username);
    return result;
  }

  @Get("/test-toi-history-current-time")
  async getHistoryCurrentTimeByStep(
    @Query('username') username: string,
    @Query('nextId') nextId: number,
    @Req() req: Request
  ): Promise<Date | null> {
    const status = await this.recordStatusService.getRecordStatus(username);
    // this.logger.log(`Username from token: ${username}`);
    const result = await this.toiHistoryService.getCurrentTimeByStep(nextId, status.tableNumber);
    return result;
  }
}
