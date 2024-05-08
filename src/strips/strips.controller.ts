import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import Strips from 'src/db/models/strips.model';
import { AccessTokenGuard } from '../auth/guards/access.token.guard';
import { UseGuards } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';


@Controller('strips')
export class StripsController {
  private readonly log = new Logger(StripsController.name);
  constructor(
    @InjectModel(Strips) private readonly stripsModel: typeof Strips,
  ) {
    this.log.log('Init controller');
  }

  // @Public()
  @UseGuards(AccessTokenGuard)
  @Get()
  async getAllStrips(): Promise<any[]> {
    try {
      const strips = await this.stripsModel.findAll();
      return strips;
    } catch (error) {
      console.error('Error retrieving points:', error);
      throw error;
    }
  }
}
