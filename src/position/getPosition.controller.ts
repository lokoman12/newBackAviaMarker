import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import PositionAM from 'src/db/models/position.model';
import { AccessTokenGuard } from '../auth/guards/access.token.guard';
import { UseGuards } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';


@Controller('position')
export class PositionController {
  private readonly log = new Logger(PositionController.name);

  constructor(
    @InjectModel(PositionAM) private readonly positionModel: typeof PositionAM,
  ) {
    this.log.log('Init controller');
  }

  // @Public()
  @UseGuards(AccessTokenGuard)
  @Get()
  async getAllAlram(): Promise<PositionAM[]> {
    try {
      const position = await this.positionModel.findAll();
      return position;
    } catch (error) {
      console.error('Error retrieving alarm:', error);
      throw error;
    }
  }
}