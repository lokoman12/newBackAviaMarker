import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import { AODB } from 'src/db/models/fpln.model';


@Controller('aodb')
export class AODBController {
  private readonly log = new Logger(AODBController.name);

  constructor(
    @InjectModel(AODB) private readonly AODBModel: typeof AODB,
  ) {
    this.log.log('Init controller');
  }

  @Get()
  async getAllAodb(): Promise<AODB[]> {
    try {
      const aodb = await this.AODBModel.findAll();
      return aodb;
    } catch (error) {
      console.error('Error retrieving alarm:', error);
      throw error;
    }
  }
}