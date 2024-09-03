import { Controller, Post, Query, Body } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import VppStatus from 'src/db/models/vppStatus.model';
import { AccessTokenGuard } from '../auth/guards/access.token.guard';
import { UseGuards } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('vppStatusChange')
export class VppChangeStatusController {
  private readonly logger = new Logger(VppChangeStatusController.name);

  constructor(
    @InjectModel(VppStatus) private readonly vppStatusModel: typeof VppStatus,
  ) {
    this.logger.log('Init controller');
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
        const vppStatusUpdate = await this.vppStatusModel.update(
          {
            close_vpp: 1,
            // RegimL: 5,
            // RegimR: 5,
          },
          {
            where: { vpp_name: name },
          },
        );
        return vppStatusUpdate;
      }
      if (status === 'open') {
        const vppStatusUpdate = await this.vppStatusModel.update(
          {
            close_vpp: 0,
            // RegimL: 10,
            // RegimR: 10,
          },
          {
            where: { vpp_name: name },
          },
        );
        return vppStatusUpdate;
      }
    } catch (error) {
      this.logger.error('Error updating VppStatus:', error);
      throw error;
    }
  }
}
