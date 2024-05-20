import {
  Controller,
  Get,
  Logger,
} from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import HistoryService from './historyService';
import ToiCopyToHistoryScheduler from './toi.copy.history.scheduler';

@Controller('history')
export class HistoryController {
  private readonly log = new Logger(HistoryController.name);

  constructor(
    private historyService: HistoryService,
    private scheduler: ToiCopyToHistoryScheduler
  ) { }

  @Public()
  @Get('/')
  async getAllSettings() {
    const result = this.scheduler.toiCopyToHistory();
    return {};
  }
}
