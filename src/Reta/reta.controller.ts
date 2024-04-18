import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import Reta from 'src/db/models/reta.model';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';


@Controller('reta')
export class RetaController {
  private readonly log = new Logger(RetaController.name);

  constructor(@InjectModel(Reta) private readonly retaModel: typeof Reta) {
    this.log.log('Init controller');
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllReta(): Promise<any[]> {
    try {
      const reta = await this.retaModel.findAll();

      return reta;
    } catch (error) {
      console.error('Error retrieving points:', error);
      throw error;
    }
  }
}
