import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import Scout from 'src/db/models/scout.model';
import { AccessTokenGuard } from '../auth/guards/access.token.guard';
import { UseGuards } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';


@Controller('/scout')
export class ScoutController {
  private readonly logger = new Logger(ScoutController.name);

  constructor(
    @InjectModel(Scout) private readonly ScoutModel: typeof Scout,
  ) {
    this.logger.log('Init controller');
  }

  @Public()
  // @UseGuards(AccessTokenGuard)
  @Get()
  async getAllScout(): Promise<Scout[]> {
    try {
      const scout = await this.ScoutModel.findAll();
      return scout;
    } catch (error) {
      console.error('Error retrieving scout:', error);
      throw error;
    }
  }
}