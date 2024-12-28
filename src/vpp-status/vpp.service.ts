import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, vpp, } from '@prisma/client';
import { ApiConfigService } from 'src/config/api.config.service';

@Injectable()
export default class VppService {
  private readonly logger = new Logger(VppService.name);

  constructor(
    private readonly configService: ApiConfigService,
    private prismaService: PrismaService,
  ) {
    // this.logger.log('Init service');
  }

  async getActualData(): Promise<Array<vpp>> {
    try {
      const vppStatus = await this.prismaService.vpp.findMany();
      return vppStatus;
    } catch (error) {
      console.error('Error retrieving vpp:', error);
      throw error;
    }
  }

  async updateVppByVppName(data: Prisma.vppUpdateInput, vppName: string): Promise<Array<vpp>> {
    try {
      const airport = this.configService.getActiveAirport().toLowerCase();
      await this.prismaService.vpp.updateMany({
        where: {
          vpp_name: vppName,
          airport,
        },
        data,
      });

      const vppStatus = await this.prismaService.vpp.findMany({
        where: {
          vpp_name: vppName,
          airport,
        }
      });

      return vppStatus;
    } catch (error) {
      console.error('Error update clode vpp:', error);
      throw error;
    }
  }

}
