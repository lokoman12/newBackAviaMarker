import { Controller, Get } from '@nestjs/common';
import { Logger } from '@nestjs/common';
// import { AccessTokenGuard } from '../auth/guards/access.token.guard';
// import { UseGuards } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import OmnicomService from './omnicom.service';
import { SCOUT } from '@prisma/client';


@Controller('/omnicom')
export class OmnicomController {
  private readonly logger = new Logger(OmnicomController.name);

  constructor(
    private readonly omnicomService: OmnicomService,
  ) {
    // this.logger.log('Init controller');
  }

  @Public()
  // @UseGuards(AccessTokenGuard)
  @Get()
  async getAllOmnicom(): Promise<Array<SCOUT>> {
    return this.omnicomService.getActualData();
  }
}