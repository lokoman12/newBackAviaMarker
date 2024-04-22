import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import ZoneAM from 'src/db/models/zone.model';
import { AccessTokenGuard } from '../auth/guards/access.token.guard';
import { UseGuards } from '@nestjs/common';


@Controller('zone')
export class ZoneController {
  private readonly log = new Logger(ZoneController.name);

  constructor(
    @InjectModel(ZoneAM) private readonly zoneModel: typeof ZoneAM,
  ) {
    this.log.log('Init controller');
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  async getAllZone(): Promise<ZoneAM[]> {
    try {
      const zone = await this.zoneModel.findAll();
      return zone;
    } catch (error) {
      this.log.error('Error retrieving alarm:', error);
      throw error;
    }
  }
}