import { Controller, Get } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import VppStatus from 'src/db/models/vppStatus.model';
import { AccessTokenGuard } from '../auth/guards/access.token.guard';
import { UseGuards } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import VppService from './vpp.service';


@Controller('/vpp')
export class VppStatusController {
  private readonly logger = new Logger(VppStatusController.name);

  constructor(
    private readonly vppService: VppService
  ) {
    this.logger.log('Init controller');
  }

  @Public()
  // @UseGuards(AccessTokenGuard)
  @Get()
  async getAllVppStatus(): Promise<Array<VppStatus>> {
    return this.vppService.getActualData();
  }
}
