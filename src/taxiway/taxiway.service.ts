
import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { taxiway } from '@prisma/client';

@Injectable()
export default class TaxiwayService {
  private readonly logger = new Logger(TaxiwayService.name);

  constructor(
    private prismaService: PrismaService,
  ) {
    // this.logger.log('Init service');
  }

  async getActualData(): Promise<Array<taxiway>> {
    try {
      const taxiway = await this.prismaService.taxiway.findMany();
      return taxiway;
    } catch (error) {
      console.error('Error retrieving taxiway:', error);
      throw error;
    }
  }

}
