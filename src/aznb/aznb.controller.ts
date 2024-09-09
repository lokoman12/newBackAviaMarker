import { Controller, Get } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { AccessTokenGuard } from '../auth/guards/access.token.guard';
import { UseGuards } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import AznbService from './aznb.service';
import Aznb from 'src/db/models/aznb.model';


@Controller('/omnicom')
export class AznbController {
  private readonly logger = new Logger(AznbController.name);

  constructor(
    private readonly aznbService: AznbService,
  ) {
    this.logger.log('Init controller');
  }

  @Public()
  // @UseGuards(AccessTokenGuard)
  @Get()
  async getAllAznb(): Promise<Array<Aznb>> {
    return this.aznbService.getActualData();
  }
}