import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import { Toi } from 'src/db/models/toi.model';
import { flatOffsetMeterToLongitudeLatitude } from 'src/Utils/XYtoLanLon';


@Controller('toi')
export class ToiController {
  private readonly log = new Logger(ToiController.name);

  constructor(@InjectModel(Toi) private readonly toiModel: typeof Toi) {
    this.log.log('Init controller');
  }

  @Get()
  async getAllToi(): Promise<any[]> {
    try {
      const toi = await this.toiModel.findAll();
      const toiFiltered = toi.filter((item) => item.Number !== 0);
      const formattedToi = toiFiltered.map((item) => {
        const [lat, lon] = flatOffsetMeterToLongitudeLatitude(
          [37.4130555556,55.972], 
          item.Y, 
          item.X
        );
        return {
          id: item.id,
          Name: item.Name,
          coordinates: {
            lat: lat,
            lon: lon,
          },
          curs: item.CRS,
          alt: item.H,
          faza: item.faza,
          Number: item.Number,
        };
      });

      // Возвращаем отформатированный массив
      return formattedToi;
    } catch (error) {
      console.error('Error retrieving points:', error);
      throw error;
    }
  }
}
