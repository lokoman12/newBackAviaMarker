import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import ZoneAM from 'src/db/models/zone.model';
import { AccessTokenGuard } from '../auth/guards/access.token.guard';
import { UseGuards } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';


@Controller('/zone')
export class ZoneController {
  private readonly logger = new Logger(ZoneController.name);

  constructor(
    @InjectModel(ZoneAM) private readonly zoneModel: typeof ZoneAM,
  ) {
    this.logger.log('Init controller');
  }

  @Public()
  // @UseGuards(AccessTokenGuard)
  @Get()
  async getAllZone(): Promise<Array<ZoneAM>> {
    try {
      const zones = await this.zoneModel.findAll();
      return zones;
    } catch (error) {
      this.logger.error('Error retrieving zones:', error);
      throw error;
    }
  }
}