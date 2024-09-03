import { Controller, Get, Injectable, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import { flatOffsetMeterToLongitudeLatitude } from 'src/utils/XYtoLanLon';
import Toi, { IToi } from 'src/db/models/toi.model';
import Formular, { IFormular } from 'src/db/models/Formular.model';
import { ApiConfigService } from 'src/config/api.config.service';
import { AccessTokenGuard } from '../auth/guards/access.token.guard';
import { UseGuards } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { Request } from 'express';
import { Op } from 'sequelize';
import { pick } from 'lodash';
import { nonNull } from 'src/utils/common';

export interface ActualToi {
  toi: IToi;
  formular: IFormular;
}

export type ActualClientToi = Partial<IToi> & {
  formular: Array<IFormular>
}

@Injectable()
export default class ToiService {
  private readonly logger = new Logger(ToiService.name);

  constructor(
    private configService: ApiConfigService,
    @InjectModel(Toi) private readonly toiModel: typeof Toi,
    @InjectModel(Formular) private readonly formularModel: typeof Formular,
  ) {
    this.logger.log('Init controller');
  }

  async getActualData(): Promise<Array<ActualToi>> {
    try {
      const toi = await this.toiModel.findAll({
        raw: true,
        where: {
          Number: {
            [Op.not]: 0,
          },
        }
      });

      const formattedToi = await Promise.all(
        toi.map(async (item) => {
          const formular = await this.formularModel.findOne({
            raw: true,
            where: { 
              id: item.id_Sintez, 
            },
          });

          return {
            toi: { ...item },
            formular: { ...formular },
          };
        })
      );

      return formattedToi.filter(it => nonNull(it.formular.Source_ID));
    } catch (error) {
      this.logger.error('Error retrieving points:', error);
      throw error;
    }
  }

  async getActualClientData(): Promise<Array<ActualClientToi>> {
    const attualToi = await this.getActualData();
    return attualToi.map(toiItem => {
      const [lat, lon] = flatOffsetMeterToLongitudeLatitude(
        this.configService.getActiveAirportPosition(),
        toiItem.toi.Y,
        toiItem.toi.X
      );
      return {
        ...pick(toiItem.toi, ['id', 'Name', 'faza', 'Number']),
        coordinates: {
          lat: lat,
          lon: lon,
        },
        curs: toiItem.toi.CRS,
        alt: toiItem.toi.H,
        type: toiItem.toi.Type,
        formular: [toiItem.formular],
      };
    });
  }

}
