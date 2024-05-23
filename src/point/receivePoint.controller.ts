import { Controller, Post, Query, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { ApiBody, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('receivePoint')
export class ReceivePointController {
  private readonly logger = new Logger(ReceivePointController.name);

  constructor(
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
  @UseInterceptors(FileInterceptor('file'))
  async createPointCheckSaveFile(
    @UploadedFile() file,
    // @Req() request: Request,
    @Query('name') name?: string,
  ): Promise<object> {
    const { fieldname, originalname, encoding, size, filename } = file
    this.logger.log(`Received fieldname: ${fieldname}, originalname: ${originalname}, size: ${size}, encoding: ${encoding}`);
    // this.logger.log(request);
    try {
      return {};
    } catch (error) {
      this.logger.error('Ошибка при создании точки:', error);
      throw error;
    }
  }
}
