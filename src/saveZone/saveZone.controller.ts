import { Controller, Post, Body, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import ZoneAM from 'src/db/models/zone.model';
import { AccessTokenGuard } from '../auth/guards/access.token.guard';
import { UseGuards } from '@nestjs/common';


interface Coord {
  lat: number,
  lon: number,
}

@Controller('saveZone')
export class SaveZoneController {
  private readonly log = new Logger(SaveZoneController.name);

  constructor(
    @InjectModel(ZoneAM) private readonly zoneModel: typeof ZoneAM,
  ) {
    this.log.log('Init controller');
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  async saveZone(
    @Query('name') name: string,
    @Body() coordination: Coord[],
  ): Promise<ZoneAM> {
    try {
        let zone: ZoneAM | null = await this.zoneModel.findOne({ where: { name: name } });
  
        if (zone) {
          await zone.update({ coordination });
          return zone;
        } else {
          const saveZone = await this.zoneModel.create({
            name: name,
            coordination: coordination,
          });
          return saveZone;
        }

    } catch (error) {
      this.log.error('Error saving alarm:', error);
      throw error;
    }
  }
}
