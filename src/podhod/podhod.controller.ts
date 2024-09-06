import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import Podhod from 'src/db/models/podhod.model';
import { AccessTokenGuard } from '../auth/guards/access.token.guard';
import { UseGuards } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';


@Controller('podhod')
export class PodhodController {
  private readonly logger = new Logger(PodhodController.name);

  constructor(
    @InjectModel(Podhod) private readonly podhodModel: typeof Podhod,
  ) {
    this.logger.log('Init controller');
  }

  @Public()
  // @UseGuards(AccessTokenGuard)
  @Get()
  async getAllPodhod(): Promise<Array<Podhod>> {
    try {
      const podhod = await this.podhodModel.findAll();
      return podhod;
    } catch (error) {
      console.error('Error retrieving podhod:', error);
      throw error;
    }
  }
}