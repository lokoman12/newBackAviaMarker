import { Controller, Post, Query, Body } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { AccessTokenGuard } from '../auth/guards/access.token.guard';
import { UseGuards } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import VppService from './vpp.service';

@Controller('/vppStatusChange')
export class VppChangeStatusController {
  private readonly logger = new Logger(VppChangeStatusController.name);

  constructor(
    private readonly vppService: VppService
  ) {
    // this.logger.log('Init controller');
  }

  @Public()
  // @UseGuards(AccessTokenGuard)
  @Post()
  async updateVppStatus(
    @Query('name') name: string,
    @Query('status') status: string,
  ): Promise<any> {
    try {
      if (status === 'close') {
        const vppStatusUpdate = await this.vppService.updateVppByVppName(
          { close_vpp: 1, }, name);
        return vppStatusUpdate;
      }
      if (status === 'open') {
        const vppStatusUpdate = await this.vppService.updateVppByVppName(
          { close_vpp: 0, }, name);
        return vppStatusUpdate;
      }
    } catch (error) {
      this.logger.error('Error updating VppStatus:', error);
      throw error;
    }
  }
}
