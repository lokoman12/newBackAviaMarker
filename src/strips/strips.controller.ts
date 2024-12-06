import { Controller, Get } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import StripsService from './strips.service';
import { strips } from '@prisma/client';


@Controller('/strips')
export class StripsController {
  private readonly logger = new Logger(StripsController.name);
  constructor(
    private readonly stripsService: StripsService,
  ) {
    this.logger.log('Init controller');
  }

  @Public()
  // @UseGuards(AccessTokenGuard)
  @Get()
  async getAllStrips(): Promise<Array<strips>> {
      return this.stripsService.getActualData();
  }
}
