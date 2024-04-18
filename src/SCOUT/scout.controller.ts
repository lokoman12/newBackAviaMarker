import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import SCOUT from 'src/db/models/scout.model';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';


@Controller('scout')
export class SCOUTController {
  private readonly log = new Logger(SCOUTController.name);

  constructor(
    @InjectModel(SCOUT) private readonly ScoutModel: typeof SCOUT,
  ) {
    this.log.log('Init controller');
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllScout(): Promise<SCOUT[]> {
    try {
      const scout = await this.ScoutModel.findAll();
      return scout;
    } catch (error) {
      console.error('Error retrieving alarm:', error);
      throw error;
    }
  }
}