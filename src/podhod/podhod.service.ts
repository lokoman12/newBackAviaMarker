import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { podhod } from '@prisma/client';

@Injectable()
export default class PodhodService {
  private readonly logger = new Logger(PodhodService.name);

  constructor(
    private prismaService: PrismaService
  ) {
    this.logger.log('Init service');
  }

  async getActualData(): Promise<Array<podhod>> {
    try {
      const podhod = await this.prismaService.podhod.findMany();
      return podhod;
    } catch (error) {
      console.error('Error retrieving podhod:', error);
      throw error;
    }
  }

}
