import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { flatOffsetMeterToLonLatObject } from 'src/utils/XYtoLanLon';
import { ApiConfigService } from 'src/config/api.config.service';
import { HistoryResponseType } from 'src/history/types';
import { PrismaService } from 'src/prisma/prisma.service';
import { azn_b, formular, meteo, SCOUT, stands_aodb, toi } from '@prisma/client';
import { saveStringifyBigInt } from './toi.controller';
import { omit } from 'lodash';

export interface ActualToi {
  toi: toi;
  formular: formular;
}

export type ActualClientToi = Partial<toi> & {
  formular: Array<formular>
}

export type GeneralActualType = Array<ActualClientToi> | Array<SCOUT> | Array<meteo> | Array<stands_aodb> | Array<azn_b>;

export type GeneralResponseType = GeneralActualType | HistoryResponseType;

@Injectable()
export default class ToiService {
  private readonly logger = new Logger(ToiService.name);

  constructor(
    private configService: ApiConfigService,
    private prismaService: PrismaService,
  ) {
    // this.logger.log('Init controller');
  }

  // В призме нет динамических ассоциаций. В отличие от стквалайза. Между toi и formular нет связи в базе. Потому выполняем запрос через join и выбираем колонки вручную. Чтобы не делать массив промисов, но выбирать все строки для связки toi-formular за раз
  async getActualData(): Promise<Array<ActualClientToi>> {
    const activeAirportPosition = this.configService.getActiveAirportPosition();

    const toiColumns = ['toiId', 'toiName', 'toiFaza', 'toiNumber', 'toiType','toiX', 'toiY','toiH', 'toiCurs',];

    this.prismaService.formular.findMany
    const actualToi = (await this.prismaService.$queryRaw`
    SELECT toi.id as toiId, toi.Name as toiName, toi.faza as toiFaza, toi.Number as toiNumber, toi.Type as toiType, toi.X as toiX, toi.Y as toiY, toi.H as toiH, toi.CRS as toiCurs, formular.*
    FROM toi JOIN formular ON formular.id = toi.id_Sintez`) as Array<any>;

    const result = actualToi.map(it => {
      return {
        id: it.toiId,
        Name: it.toiName,
        faza: it.toiFaza,
        Number: it.toiNumber,
        curs: it.toiCurs,
        alt: it.toiH,
        type: it.toiType,
        coordinates: flatOffsetMeterToLonLatObject(
          activeAirportPosition, it.toiY, it.toiX
        ),
        formular: {...omit(it, toiColumns)},
      };
    });

    // Призма неявно может преобразовывать обычные целые в BigInt. NestJS даст ошибку при неявной сериализации этого типа в контроллерах. JSON.stringify не умеет сериализовывать BigInt
    return saveStringifyBigInt(result);
  }
}
