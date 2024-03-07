import { Controller, Post, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import { PositionAM } from 'src/db/models/position.model';

@Controller('savePosition')
export class SavePositionController {
  private readonly log = new Logger(SavePositionController.name);

  constructor(
    @InjectModel(PositionAM) private readonly positionModel: typeof PositionAM,
  ) {
    this.log.log('Init controller');
  }

  @Post()
  async savePosition(
    @Query('id') id: number,
    @Query('lat') lat: number,
    @Query('lon') lon: number,
    @Query('name') name: string,
  ): Promise<PositionAM> {
    try {
      let position: PositionAM | null = await this.positionModel.findOne({ where: { id: id, name: name } });

      if (position) {
        await position.update({ lat: lat, lon: lon });
        return position;
      } else {
        const savePosition = await this.positionModel.create({
          id: id,
          lat: lat,
          lon: lon,
          name: name
        });
        return savePosition;
      }
    } catch (error) {
      console.error('Error saving alarm:', error);
      throw error;
    }
  }
}
