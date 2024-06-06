import { Controller, Get, Req } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { AccessTokenGuard } from '../auth/guards/access.token.guard';
import { UseGuards } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { Request } from 'express';
import ToiService from './toi.service';

@Controller('toi')
export class ToiController {
  private readonly log = new Logger(ToiController.name);

  constructor(
    private toiService: ToiService,
  ) {
    this.log.log('Init controller');
  }

  @Public()
  // @UseGuards(AccessTokenGuard)
  @Get()
  async getAllToi(@Req() req: Request): Promise<any[]> {
    const formattedToi = this.toiService.getActualClientToi();
    return formattedToi;
  }
}
