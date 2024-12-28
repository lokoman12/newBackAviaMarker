import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import PositionAM from 'src/db/models/position.model';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export default class PositionService {
  private readonly logger = new Logger(PositionService.name);

  constructor(
    private readonly prismaService: PrismaService,
    @InjectModel(PositionAM) private readonly positionModel: typeof PositionAM,
  ) {
    // this.logger.log('Init service');
  }

  async getActualData(): Promise<Array<PositionAM>> {
    try {
      const position = await this.positionModel.findAll({raw: true});
      return position;
    } catch (error) {
      // console.error('Error retrieving position:', error);
      // throw error;
      return [];
    }
  }

}
