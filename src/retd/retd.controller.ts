import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import Retd from 'src/db/models/retd.model';
import { AccessTokenGuard } from '../auth/guards/access.token.guard';
import { UseGuards } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';


@Controller('retd')
export class RetdController {
  private readonly log = new Logger(RetdController.name);

  constructor(@InjectModel(Retd) private readonly retdModel: typeof Retd) {
    this.log.log('Init controller');
  }

  @Public()
  // @UseGuards(AccessTokenGuard)
  @Get()
  async getAllRetd(): Promise<any[]> {
    try {
      const retd = await this.retdModel.findAll();

      return retd;
    } catch (error) {
      console.error('Error retrieving points:', error);
      throw error;
    }
  }
}
