import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import { AODB } from 'src/db/models/fpln.model';
import { SCOUT } from 'src/db/models/scout.model';


@Controller('omnicom')
export class OmnicomController {
  private readonly log = new Logger(OmnicomController.name);

  constructor(
    @InjectModel(SCOUT) private readonly OmnicomModel: typeof SCOUT,
  ) {
    this.log.log('Init controller');
  }

  @Get()
  async getAllAOmnicom(): Promise<SCOUT[]> {
    try {
      const omnicom = await this.OmnicomModel.findAll();
      return omnicom;
    } catch (error) {
      console.error('Error retrieving alarm:', error);
      throw error;
    }
  }
}