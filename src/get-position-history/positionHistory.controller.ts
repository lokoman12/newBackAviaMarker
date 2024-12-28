import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import PositionHistory from 'src/db/models/positionHistory.model';


@Controller('/getPositionHistory')
export class PositionHistoryController {
  private readonly logger = new Logger(PositionHistoryController.name);

  constructor(
    @InjectModel(PositionHistory) private readonly positionHistoryModel: typeof PositionHistory,
  ) {
    // this.logger.log('Init controller');
  }

  @Public()
  // @UseGuards(AccessTokenGuard)
  @Get()
  async getAllPodhod(): Promise<PositionHistory[]> {
    try {
      const positionHistory = await this.positionHistoryModel.findAll();
      return positionHistory;
    } catch (error) {
      console.error('Error retrieving positionHistory:', error);
      throw error;
    }
  }
}