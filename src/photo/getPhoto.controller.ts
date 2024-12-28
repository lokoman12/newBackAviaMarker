import { Controller, Get, NotFoundException, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { ApiQuery } from '@nestjs/swagger';
import Photo from 'src/db/models/photo.model';

interface IGetPhotoResponse {
  id: number;
  type: number;
  photo: string;
}

@Controller('/getPhoto')
export class GetPhotoController {
  private readonly logger = new Logger(GetPhotoController.name);

  constructor(
    @InjectModel(Photo) private readonly photoModel: typeof Photo) {
    // this.logger.log('Init controller');
  }

  @ApiQuery({
    name: 'id',
    required: true,
    type: Number,
  })
  @ApiQuery({
    name: 'type',
    required: true,
    type: Number,
  })
  @Public()
  @Get()
  async getPhoto(
    @Query('id') id: number,
    @Query('type') type: number,
  ): Promise<IGetPhotoResponse> {

    try {
      const result = await this.photoModel.findOne({
        raw: true,
        where: {
          id, type,
        },
      });
      if (!result) {
        throw new NotFoundException(`Фото с id: ${id} и type: ${type} не найден`);
      }
      return result;
    } catch (error) {
      this.logger.error('Ошибка при создании точки:', error);
      throw error;
    }
  }

}
