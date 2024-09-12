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
import HistoryService from './history.service';
import { ToiHistoryResponseType } from './types';

@Controller('/history')
export class HistoryController {
  private readonly logger = new Logger(HistoryController.name);

  constructor(
    private readonly historyService: HistoryService
  ) { }

  @UseGuards(AccessTokenGuard)
  @Get("/toi-from-history")
  async getAllToi(
    @Req() req: Request
  ): Promise<ToiHistoryResponseType> {
    const { username } = req.user as User;
    // this.logger.log(`Username from token: ${username}`);
    const result = await this.historyService.getCurrentToiHistory(username);
    return result;
  }

  @UseGuards(AccessTokenGuard)
  @Get("/omnicom-from-history")
  async getAllOmnicom(
    @Req() req: Request
  ): Promise<ToiHistoryResponseType> {
    const { username } = req.user as User;
    // this.logger.log(`Username from token: ${username}`);
    const result = await this.historyService.getCurrentToiHistory(username);
    return result;
  }
}
