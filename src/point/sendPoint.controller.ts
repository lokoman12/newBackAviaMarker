import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import Point from 'src/db/models/point.model';
import { Public } from 'src/auth/decorators/public.decorator';
import { ApiBody, ApiQuery } from '@nestjs/swagger';
import * as fs from 'fs';
import axios from 'axios';

@Controller('sendPoint')
export class SendPointController {
  private readonly logger = new Logger(SendPointController.name);

  constructor(@InjectModel(Point) private readonly pointModel: typeof Point) {
    this.logger.log('Init controller');
  }

  @Public()
  @Get()
  async createPointCheckSaveFile(
    @Query('url') url: string,
    @Query('imagePath') imagePath: string,
  ): Promise<object> {
    try {
      // const url = 'http://192.168.6.124:3000/receivePoint';
      // const url = '/home/ngolosin/projects/my-lemz-repos/screenshot_20240523_134632.jpg';

      const imageFile = fs.readFileSync(imagePath);
      const blob = new Blob([imageFile], {
        type: 'image/jpeg',
      });
      const formData = new FormData();
      formData.append('file', blob, 'file.jpg');

      await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      this.logger.log('Sent');
      return {};
    } catch (error) {
      this.logger.error('Ошибка при отправки точки:', error);
      throw error;
    }
  }
}
