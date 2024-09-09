import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import Stands from 'src/db/models/stands.model';
import { AccessTokenGuard } from '../auth/guards/access.token.guard';
import { UseGuards } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import StandService from './stand.service';


@Controller('/stand')
export class StandController {
  private readonly logger = new Logger(StandController.name);

  constructor(
    @InjectModel(Stands) private readonly standModel: typeof Stands,
    private readonly standService: StandService
  ) {
    this.logger.log('Init controller');
  }

  @Public()
  // @UseGuards(AccessTokenGuard)
  @Get()
  async getAllStand(): Promise<Array<Stands>> {
      return this.standService.getActualData();
  }
}