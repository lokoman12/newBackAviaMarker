import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import AODB from 'src/db/models/fpln.model';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export default class FplnService {
  private readonly logger = new Logger(FplnService.name);

  constructor(
    private readonly prismaService: PrismaService,
    @InjectModel(AODB) private readonly flightPlanModel: typeof AODB,
  ) {
    // this.logger.log('Init service');
  }

  async getActualData(): Promise<Array<AODB>> {
    try {
      const flightPlan = await this.flightPlanModel.findAll({raw: true});
      return flightPlan;
    } catch (error) {
      console.error('Error retrieving flight plan:', error);
      throw error;
    }
  }

}
