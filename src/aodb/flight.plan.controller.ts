import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import AODB from 'src/db/models/fpln.model';
import { AccessTokenGuard } from '../auth/guards/access.token.guard';
import { UseGuards } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';


@Controller('aodb')
export class AodbController {
  private readonly logger = new Logger(AodbController.name);

  constructor(
    @InjectModel(AODB) private readonly AODBModel: typeof AODB,
  ) {
    this.logger.log('Init controller');
  }

  @Public()
  // @UseGuards(AccessTokenGuard)
  @Get()
  async getAllAodb(): Promise<Array<AODB>> {
    try {
      const aodb = await this.AODBModel.findAll();
      return aodb;
    } catch (error) {
      console.error('Error retrieving flight plans:', error);
      throw error;
    }
  }
}