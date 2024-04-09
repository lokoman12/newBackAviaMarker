import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import { Reta } from 'src/db/models/reta.model';
import VppStatus from 'src/db/models/vppStatus.model';

@Controller('vpp')
export class VppStatusController {
  private readonly log = new Logger(VppStatusController.name);

  constructor(@InjectModel(VppStatus) private readonly vppStatusModel: typeof VppStatus) {
    this.log.log('Init controller');
  }

  @Get()
  async getAllVppStatus(): Promise<any[]> {
    try {
      const vppStatus = await this.vppStatusModel.findAll();

      return vppStatus;
    } catch (error) {
      console.error('Error retrieving points:', error);
      throw error;
    }
  }
}
