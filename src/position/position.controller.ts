import { Controller, Get } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import PositionAM from 'src/db/models/position.model';
import { AccessTokenGuard } from '../auth/guards/access.token.guard';
import { UseGuards } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import PositionService from './position.service';


@Controller('/position')
export class PositionController {
  private readonly logger = new Logger(PositionController.name);

  constructor(
    private readonly positionService: PositionService,
  ) {
    this.logger.log('Init controller');
  }

  @Public()
  // @UseGuards(AccessTokenGuard)
  @Get()
  async getAllAlram(): Promise<Array<PositionAM>> {
      return this.positionService.getActualData();
  }
}