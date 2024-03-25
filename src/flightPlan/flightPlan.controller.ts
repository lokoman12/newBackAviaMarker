import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import FlightPlan from 'src/db/models/fpln.model';


@Controller('fpln')
export class FlightPlanController {
  private readonly log = new Logger(FlightPlanController.name);

  constructor(
    @InjectModel(FlightPlan) private readonly flightPlanModel: typeof FlightPlan,
  ) {
    this.log.log('Init controller');
  }

  @Get()
  async getAllFpln(): Promise<FlightPlan[]> {
    try {
      const fpln = await this.flightPlanModel.findAll();
      return fpln;
    } catch (error) {
      this.log.error('Error retrieving alarm:', error);
      throw error;
    }
  }
}