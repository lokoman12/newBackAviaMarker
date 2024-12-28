import { Controller, Get, Post, Query } from '@nestjs/common';
import { Logger } from '@nestjs/common';
// import { AccessTokenGuard } from '../auth/guards/access.token.guard';
// import { UseGuards } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { rdd } from '@prisma/client';
import { RdStatusService } from './rd.status.service';


@Controller('/rdStatus')
export class RdStatusController {
  private readonly logger = new Logger(RdStatusController.name);

  constructor(
    private readonly rdStatusService: RdStatusService
  ) {
    // this.logger.log('Init controller');
  }

  @Public()
  // @UseGuards(AccessTokenGuard)
  @Get()
  async getAllRdStatus(): Promise<Array<rdd>> {
    try {
      const rdStatus = await this.rdStatusService.getActualData();
      return rdStatus;
    } catch (error) {
      console.error('Error retrieving rd:', error);
      throw error;
    }
  }

  @Public()
  // @UseGuards(AccessTokenGuard)
  @Post()
  async updateRdStatus(
    @Query('name') name: string,
    @Query('status') status: string,
  ): Promise<void> {
    return this.rdStatusService.updateRdStatus(name, status);
  }
}
