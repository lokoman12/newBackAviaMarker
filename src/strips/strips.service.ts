import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { strips } from '@prisma/client';
import { saveStringifyBigInt } from 'src/toi/toi.controller';

@Injectable()
export default class StripsService {
  private readonly logger = new Logger(StripsService.name);

  constructor(
    private prismaService: PrismaService
  ) {
    this.logger.log('Init service');
  }

  async getActualData(): Promise<Array<strips>> {
    try {
      const strips = await this.prismaService.strips.findMany();
      return saveStringifyBigInt(strips);
    } catch (error) {
      console.error('Error retrieving strips:', error);
      throw error;
    }
  }
}
