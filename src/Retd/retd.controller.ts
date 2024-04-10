import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import Retd from 'src/db/models/retd.model';


@Controller('retd')
export class RetdController {
  private readonly log = new Logger(RetdController.name);

  constructor(@InjectModel(Retd) private readonly retdModel: typeof Retd) {
    this.log.log('Init controller');
  }

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
