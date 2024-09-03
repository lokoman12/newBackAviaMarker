import { Controller, Post, Query, Body } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import VppStatus from 'src/db/models/vppStatus.model';
import { AccessTokenGuard } from '../auth/guards/access.token.guard';
import { UseGuards } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import RdStatus from 'src/db/models/rdStatus';

@Controller('rdStatusChange')
export class RdChangeStatusController {
  private readonly logger = new Logger(RdChangeStatusController.name);

  constructor(
    @InjectModel(RdStatus) private readonly rdStatusModel: typeof RdStatus,
  ) {
    this.logger.log('Init controller');
  }

  @Public()
  // @UseGuards(AccessTokenGuard)
  @Post()
  async updateRdStatus(
    @Query('name') name: string,
    @Query('status') status: string,
  ): Promise<any> {
    try {
      if (status === 'close') {
        const rdStatusUpdate = await this.rdStatusModel.update(
          {
            close_rd: 1,
          },
          {
            where: { name_rd: name },
          },
        );
        return rdStatusUpdate;
      }
      if (status === 'open') {
        const rdStatusUpdate = await this.rdStatusModel.update(
          {
            close_rd: 0,
          },
          {
            where: { name_rd: name },
          },
        );
        return rdStatusUpdate;
      }
    } catch (error) {
      this.logger.error('Error updating rdStatusUpdate:', error);
      throw error;
    }
  }
}
