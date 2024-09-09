import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import VppStatus from 'src/db/models/vppStatus.model';
import { AccessTokenGuard } from '../auth/guards/access.token.guard';
import { UseGuards } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import RdStatus from 'src/db/models/rdStatus';


@Controller('/rdStatus')
export class RdStatusController {
  private readonly logger = new Logger(RdStatusController.name);

  constructor(@InjectModel(RdStatus) private readonly rdStatusModel: typeof RdStatus) {
    this.logger.log('Init controller');
  }

  @Public()
  // @UseGuards(AccessTokenGuard)
  @Get()
  async getAllRdStatus(): Promise<any[]> {
    try {
      const rdStatus = await this.rdStatusModel.findAll();

      return rdStatus;
    } catch (error) {
      console.error('Error retrieving rd:', error);
      throw error;
    }
  }
}
