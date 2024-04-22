import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import Point from 'src/db/models/point.model';
import { AccessTokenGuard } from '../auth/guards/access.token.guard';
import { UseGuards } from '@nestjs/common';


@Controller('points')
export class PointController {
  private readonly log = new Logger(PointController.name);

  constructor(
    @InjectModel(Point) private readonly pointModel: typeof Point,
  ) {
    this.log.log('Init controller');
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  async getAllPoints(): Promise<Point[]> {
    try {
      const points = await this.pointModel.findAll();
      return points;
    } catch (error) {
      this.log.error('Error retrieving points:', error);
      throw error;
    }
  }
}