import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { meteo } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export default class MeteoService {
  private readonly logger = new Logger(MeteoService.name);

  constructor(
    private prismaService: PrismaService,
  ) {
    this.logger.log('Init service');
  }

  async getActualData(): Promise<Array<meteo>> {
    try {
      const meteo = await this.prismaService.meteo.findMany();
      return meteo;
    } catch (error) {
      console.error('Error retrieving meteo:', error);
      throw error;
    }
  }

}
