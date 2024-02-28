import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import { Meteo } from 'src/db/models/meteo.model';

@Controller('meteo')
export class MeteoController {
  private readonly log = new Logger(MeteoController.name);

  constructor(
    @InjectModel(Meteo) private readonly meteoModel: typeof Meteo,
  ) {
    this.log.log('Init controller');
  }

  @Get()
  async getAllMeteo(): Promise<Meteo[]> {
    try {
      const meteo = await this.meteoModel.findAll();
      return meteo;
    } catch (error) {
      console.error('Error retrieving alarm:', error);
      throw error;
    }
  }
}