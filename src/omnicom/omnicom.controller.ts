import { Controller, Get } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import SCOUT from 'src/db/models/scout.model';
import { AccessTokenGuard } from '../auth/guards/access.token.guard';
import { UseGuards } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import OmnicomService from './omnicom.service';


@Controller('omnicom')
export class OmnicomController {
  private readonly log = new Logger(OmnicomController.name);

  constructor(
    private readonly omnicomService: OmnicomService,
  ) {
    this.log.log('Init controller');
  }

  @Public()
  // @UseGuards(AccessTokenGuard)
  @Get()
  async getAllOmnicom(): Promise<Array<SCOUT>> {
    return this.omnicomService.getActualOmnicom();
  }
}