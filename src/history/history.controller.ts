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
import { ActualClientToi } from 'src/toi/toi.service';
import HistoryService from './history.service';

@Controller('history')
export class HistoryController {
  private readonly logger = new Logger(HistoryController.name);

  constructor(
    private readonly historyService: HistoryService
  ) { }

  @UseGuards(AccessTokenGuard)
  @Get("/toi-from-history")
  async getAllToi(
    @Req() req: Request
  ): Promise<Array<ActualClientToi>> {
    const { username } = req.user as User;
    this.logger.log(`Username from token: ${username}`);
    const result = await this.historyService.getCurrentHistory(username);
    return result;
  }
}
