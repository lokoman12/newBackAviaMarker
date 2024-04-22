import { Controller, Get, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import { flatOffsetMeterToLongitudeLatitude } from 'src/Utils/XYtoLanLon';
import Toi from 'src/db/models/toi.model';
import Formular from 'src/db/models/Formular.model';
import { ApiConfigService } from 'src/config/api.config.service';
import { AccessTokenGuard } from '../auth/guards/access.token.guard';
import { UseGuards } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { Request } from 'express';


@Controller('toi')
export class ToiController {
  private readonly log = new Logger(ToiController.name);

  constructor(
    private configService: ApiConfigService,
    @InjectModel(Toi) private readonly toiModel: typeof Toi,
    @InjectModel(Formular) private readonly formularModel: typeof Formular, // Добавляем вторую модель
  ) {
    this.log.log('Init controller');
  }
  
  @Public()
  // @UseGuards(AccessTokenGuard)
  @Get()
  async getAllToi(@Req() req: Request): Promise<any[]> {
    this.log.log('ToiController, cookie: ' + req.cookies.test + ', ' + JSON.stringify(req.cookies));
    try {
      const toi = await this.toiModel.findAll();
      const toiFiltered = toi.filter((item) => item.Number !== 0);
      const formattedToi = await Promise.all(toiFiltered.map(async (item) => {
        const formular = await this.formularModel.findAll({where: {id: item.id_Sintez}});
        const [lat, lon] = flatOffsetMeterToLongitudeLatitude(
          this.configService.getActiveAirportPosition(),
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
          type: item.Type,
          formular: formular,
        };
      }));

      return formattedToi;
    } catch (error) {
      this.log.error('Error retrieving points:', error);
      throw error;
    }
  }
}
