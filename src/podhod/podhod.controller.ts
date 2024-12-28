import { Controller, Get } from '@nestjs/common';
import { Logger } from '@nestjs/common';
// import { AccessTokenGuard } from '../auth/guards/access.token.guard';
// import { UseGuards } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { podhod } from '@prisma/client';
import PodhodService from './podhod.service';


@Controller('/podhod')
export class PodhodController {
  private readonly logger = new Logger(PodhodController.name);

  constructor(
    private readonly podhodService: PodhodService,
  ) {
    // this.logger.log('Init controller');
  }

  @Public()
  // @UseGuards(AccessTokenGuard)
  @Get()
  async getAllPodhod(): Promise<Array<podhod>> {
    try {
      const podhod = await this.podhodService.getActualData();
      return podhod;
    } catch (error) {
      console.error('Error retrieving podhod:', error);
      throw error;
    }
  }
}