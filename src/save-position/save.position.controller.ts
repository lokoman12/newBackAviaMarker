import { Controller, Post, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import PositionAM from 'src/db/models/position.model';
import { AccessTokenGuard } from '../auth/guards/access.token.guard';
import { UseGuards } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import PositionHistory from 'src/db/models/positionHistory.model';


@Controller('savePosition')
export class SavePositionController {
  private readonly log = new Logger(SavePositionController.name);

  constructor(
    @InjectModel(PositionAM) private readonly positionModel: typeof PositionAM,
    @InjectModel(PositionHistory) private readonly positionHistoryModel: typeof PositionHistory,
  ) {
    this.log.log('Init controller');
  }

  @Public()
  // @UseGuards(AccessTokenGuard)
  @Post()
  async savePosition(
    @Query('id') id: number,
    @Query('lat') lat: number,
    @Query('lon') lon: number,
    @Query('speed') speed: number,
    @Query('name') name: string,
    @Query('status') status: string,
  ): Promise<PositionAM> {
    try {
      let date = new Date().getTime()
      if(lat != null && lon != null){
        const savePosition = await this.positionHistoryModel.create({
          id: id,
          lat: lat,
          lon: lon,
          name: name,
          status: status,
          speed: speed,
          time: date,
          time_save: date
        });
        return savePosition;
      }
     


      let position: PositionAM | null = await this.positionModel.findOne({ where: { id: id, name: name } });
      if (position) {
        await position.update({ lat: lat, lon: lon, status: status, speed: speed, time: date });
        return position;
      } else {
        const savePosition = await this.positionModel.create({
          id: id,
          lat: lat,
          lon: lon,
          name: name,
          status: status,
          speed: speed,
          time: date
        });
        return savePosition;
      }
    } catch (error) {
      this.log.error('Error saving alarm:', error);
      throw error;
    }
  }
}
