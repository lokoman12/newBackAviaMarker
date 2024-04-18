import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import Strips from 'src/db/models/strips.model';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';


@Controller('strips')
export class StripsController {
  private readonly log = new Logger(StripsController.name);
  constructor(
    @InjectModel(Strips) private readonly stripsModel: typeof Strips,
  ) {
    this.log.log('Init controller');
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllStrips(): Promise<any[]> {
    try {
      const strips = await this.stripsModel.findAll();
      return strips;
    } catch (error) {
      console.error('Error retrieving points:', error);
      throw error;
    }
  }
}
