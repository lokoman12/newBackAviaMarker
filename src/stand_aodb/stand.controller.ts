import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import { Stands } from 'src/db/models/stands.model';

@Controller('stand')
export class StandController {
  private readonly log = new Logger(StandController.name);

  constructor(
    @InjectModel(Stands) private readonly standModel: typeof Stands,
  ) {
    this.log.log('Init controller');
  }

  @Get()
  async getAllStand(): Promise<Stands[]> {
    try {
      const stand = await this.standModel.findAll();
      return stand;
    } catch (error) {
      console.error('Error retrieving stand:', error);
      throw error;
    }
  }
}