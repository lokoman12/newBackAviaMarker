import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import { flatOffsetMeterToLonLatArray, flatOffsetMeterToLonLatObject } from 'src/utils/XYtoLanLon';
import Toi, { IToi } from 'src/db/models/toi.model';
import Formular, { IFormular } from 'src/db/models/Formular.model';
import { ApiConfigService } from 'src/config/api.config.service';
import { BelongsTo, Op, Sequelize } from 'sequelize';
import { pick, omit } from 'lodash';
import { nonNull } from 'src/utils/common';
import { HistoryResponseType } from 'src/history/types';
import Scout from 'src/db/models/scout.model';
import Meteo from 'src/db/models/meteo.model';
import Stands from 'src/db/models/stands.model';
import Aznb from 'src/db/models/aznb.model';
import { Exclude } from 'class-transformer';

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
          id_Sintez: {
            [Op.not]: -1
          }
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

  async getActualClientDataOld(): Promise<Array<ActualClientToi>> {
    // this.logger.log(`Toi getActualData, start`);
    const attualToi = await this.getActualData();
    return attualToi.map(toiItem => {
      const [lat, lon] = flatOffsetMeterToLonLatArray(
        this.configService.getActiveAirportPosition(),
        toiItem.toi.Y,
        toiItem.toi.X
      );
      return {
        ...pick(toiItem.toi, ['id', 'Name', 'faza', 'Number',]),
        coordinates: {
          lat, lon,
        },
        curs: toiItem.toi.CRS,
        alt: toiItem.toi.H,
        type: toiItem.toi.Type,
        formular: [toiItem.formular],
      };
    });
  }

  async getActualClientData(): Promise<Array<any>> {
    // this.logger.log(`Toi getActualData, start`);

    const activeAirportPosition = this.configService.getActiveAirportPosition();
    try {
      const toi = (await this.toiModel.findAll({
        raw: false,
        where: {
          Number: {
            [Op.not]: 0,
          },
          id_Sintez: {
            [Op.not]: -1
          }
        },
        attributes: {
          exclude: ['id_Sintez',],
        },
        include: [{
          model: Formular,
          required: true,
          association: new BelongsTo(Toi, Formular, {
            targetKey: 'id',
            foreignKey: 'id_Sintez',
            constraints: false,
          })
        }],
      }))
        .map(it => {
          const toiItem = it.dataValues;
          return {
            ...pick(toiItem, ['id', 'Name', 'faza', 'Number',]),
            curs: toiItem.CRS,
            alt: toiItem.H,
            type: toiItem.Type,
            coordinates: flatOffsetMeterToLonLatObject(
              activeAirportPosition, it.Y, it.X
            ),
            formular: toiItem.Formular,
          }
        });
      return toi;
    } catch (error) {
      this.logger.error('Error retrieving points:', error);
      throw error;
    }
  }

}
