import { Body, Controller, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import Point from 'src/db/models/point.model';
import { Public } from 'src/auth/decorators/public.decorator';
import { ApiBody, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { Buffer } from 'buffer'; // Импортируем модуль buffer
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('savePoints')
export class SavePointController {
  private readonly log = new Logger(SavePointController.name);

  constructor(@InjectModel(Point) private readonly pointModel: typeof Point) {
    this.log.log('Init controller');
  }

  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'description',
    required: false,
    type: String,
  })
  @ApiBody({
    required: false,
    type: String,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        }
      }
    }
  })
  @Public()
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createPoint(
    @UploadedFile() file,
    @Query('lat') lat: number,
    @Query('lon') lon: number,
    @Query('radius') radius: number,
    @Query('project') project: string,
    @Query('mode') mode: string,
    @Body('photo') photo?: string, 
    @Query('name') name?: string,
    @Query('description') description?: string,
  ): Promise<Point> {
    try {
      if (lat == null || lon == null) {
        throw new Error('Широта и долгота являются обязательными полями');
      }

      const { fieldname, originalname, encoding, size, filename } = file
      this.log.log(`Received fieldname: ${fieldname}, originalname: ${originalname}, size: ${size}, encoding: ${encoding}`);
      
      file.buffer; // Двоичные данные тут
      
      const date = new Date();

      // Приведение photo к строке и декодирование base64 строки в buffer
      const photoBuffer = photo ? Buffer.from(photo as string, 'base64') : null;
      const data = {
        name: name || '',
        time: date,
        lat,
        lon,
        radius,
        mode,
        photo: photoBuffer,
        description: description || '',
        project: project || '',
      };

      const point = await this.pointModel.create(data);
      return point;
    } catch (error) {
      this.log.error('Ошибка при создании точки:', error);
      throw error;
    }
  }

}
