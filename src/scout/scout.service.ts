
import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SCOUT, taxiway } from '@prisma/client';

@Injectable()
export default class ScoutService {
  private readonly logger = new Logger(ScoutService.name);

  constructor(
    private prismaService: PrismaService,
  ) {
    this.logger.log('Init service');
  }

  async getActualData(): Promise<Array<SCOUT>> {
    try {
      const scout = await this.prismaService.sCOUT.findMany();
      return scout;
    } catch (error) {
      console.error('Error retrieving scout:', error);
      throw error;
    }
  }

}
