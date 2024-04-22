import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import StandsGeo from 'src/db/models/standsGeo.model';


@Controller('standGeo')
export class StandGeoController {
  private readonly log = new Logger(StandGeoController.name);

  constructor(
    @InjectModel(StandsGeo) private readonly standsGeoModel: typeof StandsGeo,
  ) {
    this.log.log('Init controller');
  }

  @Get()
  async getAllStandsGeo(): Promise<StandsGeo[]> {
    try {
      const standGeo = await this.standsGeoModel.findAll();
      return standGeo;
    } catch (error) {
      console.error('Error retrieving standsGeo:', error);
      throw error;
    }
  }
}