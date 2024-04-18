import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import Retd from 'src/db/models/retd.model';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';


@Controller('retd')
export class RetdController {
  private readonly log = new Logger(RetdController.name);

  constructor(@InjectModel(Retd) private readonly retdModel: typeof Retd) {
    this.log.log('Init controller');
  }

  @UseGuards(JwtAuthGuard)
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
