import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import { ZoneAM } from 'src/db/models/zone.model';

@Controller('zone')
export class ZoneController {
  private readonly log = new Logger(ZoneController.name);

  constructor(
    @InjectModel(ZoneAM) private readonly zoneModel: typeof ZoneAM,
  ) {
    this.log.log('Init controller');
  }

  @Get()
  async getAllZone(): Promise<ZoneAM[]> {
    try {
      const zone = await this.zoneModel.findAll();
      return zone;
    } catch (error) {
      console.error('Error retrieving alarm:', error);
      throw error;
    }
  }
}