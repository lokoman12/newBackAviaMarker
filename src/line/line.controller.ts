import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import Line from 'src/db/models/line.model';
import * as turf from '@turf/turf';
import { ApiQuery } from '@nestjs/swagger';
import Photo from 'src/db/models/photo.model';
import { GeoType } from 'src/photo/types';
import { LineService } from './line.service';


@Controller('/lines')
export class LineController {
  private readonly logger = new Logger(LineController.name);

  constructor(
    private readonly lineService: LineService,
    @InjectModel(Line) private readonly lineModel: typeof Line,
    @InjectModel(Photo) private readonly photoModel: typeof Photo
  ) {
    this.logger.log('Init controller');
  }

  @Public()
  @Get()
  async getAllLine(): Promise<Line[]> {
    try {
      const lines = await this.lineService.getActualData();
      return lines;
    } catch (error) {
      this.logger.error('Error retrieving lines:', error);
      throw error;
    }
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
  @ApiQuery({
    name: 'photo',
    required: false,
    type: String,
  })
  @Public()
  @Post()
  async createLine(
    @Query('coordinates') coordinates: string,
    @Query('project') project: string,
    @Query('mode') mode: string,
    @Query('name') name: string = '',
    @Query('description') description: string = '',
    @Body('photo') imageData?: string
  ): Promise<void> {
    const line = await this.lineService.createLine({
      coordinates, project, mode,
      name, description,
    });

    await this.lineService.createPhoto({
      id: line.id,
      type: GeoType.line,
      photo: imageData,
    });
  }
}