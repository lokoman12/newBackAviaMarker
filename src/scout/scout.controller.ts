import { Controller, Get } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { SCOUT } from '@prisma/client';
import ScoutService from './scout.service';


@Controller('/scout')
export class ScoutController {
  private readonly logger = new Logger(ScoutController.name);

  constructor(
    private prismaService: PrismaService,
    private scoutService: ScoutService
  ) {
    this.logger.log('Init controller');
  }

  @Public()
  // @UseGuards(AccessTokenGuard)
  @Get()
  async getAllScout(): Promise<Array<SCOUT>> {
    try {
      const scout = await this.scoutService.getActualData();
      return scout;
    } catch (error) {
      console.error('Error retrieving scout:', error);
      throw error;
    }
  }
}