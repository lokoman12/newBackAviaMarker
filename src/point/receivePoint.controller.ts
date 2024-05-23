import { Body, Controller, Get, Post, Query, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import Point from 'src/db/models/point.model';
import { InjectModel } from '@nestjs/sequelize';
import { QueryTypes } from 'sequelize';

interface ABC {
  x?: number;
  y?: string;
  photo?: string;
}

@ApiTags('ReceivePoint')
@Controller('receivePoint')
export class ReceivePointController {
  private readonly logger = new Logger(ReceivePointController.name);

  constructor(
    @InjectModel(Point) private readonly pointModel: typeof Point
  ) {
    this.logger.log('Init controller');
  }

  @Post()
  // @ApiQuery({
  //   name: 'name',
  //   required: false,
  //   type: String,
  // })
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       file: {
  //         type: 'string',
  //         format: 'binary',
  //       }
  //     }
  //   }
  // })
  @Public()
  // @UseInterceptors(FileInterceptor('file'))
  async createPointCheckSaveFile(@Body() body: ABC
    // @UploadedFile() file,
  ): Promise<object> {
    // const { fieldname, originalname, encoding, size, filename } = file
    // this.logger.log(`Received fieldname: ${fieldname}, originalname: ${originalname}, size: ${size}, encoding: ${encoding}`);
    this.logger.log(body.photo.length);
    const x = Buffer.from(body.photo, 'base64');
    this.logger.log(x.length);
    fs.writeFileSync(
      '/home/ngolosin/projects/my-lemz-repos/screenshot1.jpg',
      x
    );
    try {
      return {};
    } catch (error) {
      this.logger.error('Ошибка при создании точки:', error);
      throw error;
    }
  }

  @Get('/saveLastImageToFs')
  @Public()
  async saveLastImageToFs(): Promise<void> {
    this.logger.log('Enter saveLastImageToFs');
    try {
      const createdPolygon = await this.pointModel.findOne({
        raw: true,
        where: {
          id: 96,
        }
      });
      if (!!createdPolygon) {
        const photo = createdPolygon.photo;
        const x = Buffer.from(photo, 'base64');
        console.log(x)
        fs.writeFileSync(
          '/home/ngolosin/projects/my-lemz-repos/screenshot2.jpg',
          x
        );
      } else {
        this.logger.log('Пусто');
      }
    } catch (error) {
      this.logger.error('Ошибка при создании точки:', error);
      throw error;
    }
  }
}
