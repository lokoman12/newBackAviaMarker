import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { parks_web, Prisma } from '@prisma/client';
import { saveStringifyBigInt } from 'src/toi/toi.controller';

@Injectable()
export default class StandGeoService {
  private readonly logger = new Logger(StandGeoService.name);

  constructor(
    private readonly prismaService: PrismaService,
  ) {
    this.logger.log('Init service');
  }

  async addActualData(body: Prisma.parks_webCreateInput): Promise<parks_web> {
    try {
      const newStandGeo = await this.prismaService.parks_web.create({
        data: {
          name: body.name,
          lat: body.lat,
          lon: body.lon,
          geojson: body.geojson,
        },
      });

      return newStandGeo;
    } catch (error) {
      console.error('Error creating stands geo:', error);
      throw error;
    }
  }

  async getActualData(): Promise<Array<parks_web>> {
    try {
      const standGeo = await this.prismaService.parks_web.findMany();
      return saveStringifyBigInt(standGeo);
    } catch (error) {
      console.error('Error retrieving stands geo:', error);
      throw error;
    }
  }

}
