import {
  Controller,
  Get,
  Logger,
  Post,
  Body,
  Param,
  Delete,
  Put,
  NotFoundException
} from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import HistoryService from './historyService';

@Controller('history')
export class HistoryController {
  private readonly log = new Logger(HistoryController.name);

  constructor(
    private historyService: HistoryService,
  ) { }

  @Public()
  @Get('/')
  async getAllSettings() {
    return {};
  }
}
