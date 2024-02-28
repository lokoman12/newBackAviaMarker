import { Controller, Post, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import { AlaramAM } from 'src/db/models/alarm.model';
import { Coordinate, ZoneAM } from 'src/db/models/zone.model';

@Controller('saveZone')
export class SaveZoneController {
  private readonly log = new Logger(SaveZoneController.name);

  constructor(
    @InjectModel(ZoneAM) private readonly zoneModel: typeof ZoneAM,
  ) {
    this.log.log('Init controller');
  }
  @Post()
  async saveZone(
    @Query('name') name: string,
    @Query('coordination') coordination: string,
  ): Promise<ZoneAM> {
    try {
      const saveZone = await this.zoneModel.create({
        coordination: coordination,
        name: name,
      });
      return saveZone;
    } catch (error) {
      console.error('Error saving alarm:', error);
      throw error;
    }
  }
}
