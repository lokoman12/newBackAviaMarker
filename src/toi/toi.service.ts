import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import { flatOffsetMeterToLongitudeLatitude } from 'src/utils/XYtoLanLon';
import Toi, { IToi } from 'src/db/models/toi.model';
import Formular, { IFormular } from 'src/db/models/Formular.model';
import { ApiConfigService } from 'src/config/api.config.service';
import { Op } from 'sequelize';
import { pick } from 'lodash';
import { nonNull } from 'src/utils/common';
import { HistoryResponseType } from 'src/history/types';
import Scout from 'src/db/models/scout.model';
import Meteo from 'src/db/models/meteo.model';
import Stands from 'src/db/models/stands.model';
import Aznb from 'src/db/models/aznb.model';

export interface ActualToi {
  toi: IToi;
  formular: IFormular;
}

export type ActualClientToi = Partial<IToi> & {
  formular: Array<IFormular>
}

export type GeneralActualType = Array<ActualClientToi> | Array<Scout> | Array<Meteo> | Array<Stands> | Array<Aznb>;

export type GeneralResponseType = GeneralActualType | HistoryResponseType;

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
    this.logger.log(`Toi getActualData, start`);
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
