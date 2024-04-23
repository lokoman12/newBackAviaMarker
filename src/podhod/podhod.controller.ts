import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import Podhod from 'src/db/models/podhod.model';
import { AccessTokenGuard } from '../auth/guards/access.token.guard';
import { UseGuards } from '@nestjs/common';
import { Public } from 'src/auth/consts';


@Controller('podhod')
export class PodhodController {
  private readonly log = new Logger(PodhodController.name);

  constructor(
    @InjectModel(Podhod) private readonly podhodModel: typeof Podhod,
  ) {
    this.log.log('Init controller');
  }

  @Public()
  // @UseGuards(AccessTokenGuard)
  @Get()
  async getAllPodhod(): Promise<Podhod[]> {
    try {
      const podhod = await this.podhodModel.findAll();
      return podhod;
    } catch (error) {
      console.error('Error retrieving alarm:', error);
      throw error;
    }
  }
}