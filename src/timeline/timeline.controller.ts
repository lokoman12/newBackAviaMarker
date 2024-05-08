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
import TimelineService from './timelineService';

@Controller('timeline')
export class TimelineController {
  private readonly log = new Logger(TimelineController.name);

  constructor(
    private timelineService: TimelineService,
  ) { }

  @Public()
  @Get('/')
  async getAllSettings() {
    return {};
  }
}
