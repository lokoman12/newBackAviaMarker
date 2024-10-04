import {
  Controller,
  Get,
  Logger,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/auth/guards/access.token.guard';
import User from 'src/db/models/user';
import ToiHistoryService from './toi.history.service';
import { HistoryResponseType } from './types';
import { InjectConnection } from '@nestjs/sequelize';
import { QueryTypes, Sequelize } from 'sequelize';

@Controller('/history')
export class HistoryController {
  private readonly logger = new Logger(HistoryController.name);

  constructor(
    @InjectConnection()
    private readonly sequelize: Sequelize,
    private readonly historyService: ToiHistoryService
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
    const result = await this.historyService.getCurrentHistory(username);
    return result;
  }

  @UseGuards(AccessTokenGuard)
  @Get("/omnicom-from-history")
  async getAllOmnicom(
    @Req() req: Request
  ): Promise<HistoryResponseType> {
    const { username } = req.user as User;
    // this.logger.log(`Username from token: ${username}`);
    const result = await this.historyService.getCurrentHistory(username);
    return result;
  }
}
