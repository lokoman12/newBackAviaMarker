import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import Line from 'src/db/models/line.model';
import * as turf from '@turf/turf';
import { ApiQuery } from '@nestjs/swagger';
import Photo from 'src/db/models/photo.model';
import { GeoType } from 'src/photo/types';
import { PrismaService } from 'src/prisma/prisma.service';


export class LineService {
  private readonly logger = new Logger(LineService.name);

  constructor(
    // private readonly prismaService: PrismaService, 
    @InjectModel(Line) private readonly lineModel: typeof Line,
    @InjectModel(Photo) private readonly photoModel: typeof Photo
  ) {
    // this.logger.log('Init service');
  }

  async getActualData(): Promise<Array<Line>> {
    try {
      const lines = await this.lineModel.findAll();
      return lines;
    } catch (error) {
      this.logger.error('Error retrieving lines:', error);
      throw error;
    }
  }

  async createPhoto(photoDto: Partial<Photo>): Promise<void> {
    if (photoDto?.photo?.length > 0) {
      const data: Partial<Photo> = {
        id: photoDto.id,
        type: GeoType.line,
        photo: photoDto.photo,
      };
      try {
        await this.photoModel.create(data);
      } catch (error) {
        this.logger.error('Error creating photo for the line:', error);
        throw error;
      }
    }
  }

  getDistance(coordinates: string): number {
    let coords: Array<any> = [];
    try {
      coords = JSON.parse(coordinates);
    } catch (error) {
      this.logger.error('Error parsing coordinates:', error);
      throw error;
    }

    if (
      !Array.isArray(coords) ||
      coords.length === 0 ||
      !coords[0].hasOwnProperty('latitude') ||
      !coords[0].hasOwnProperty('longitude')
    ) {
      throw new Error('Invalid coordinates format');
    }

    let distance = 0;
    for (let i = 0; i < coords.length - 1; i++) {
      const from = turf.point([
        parseFloat(coords[i].longitude),
        parseFloat(coords[i].latitude),
      ]);
      const to = turf.point([
        parseFloat(coords[i + 1].longitude),
        parseFloat(coords[i + 1].latitude),
      ]);
      distance += turf.distance(from, to, { units: 'meters' });
    }

    return distance;
  }

  async createLine(lineDto: Partial<Line>): Promise<Line> {
    const { coordinates, project, mode,
      name = '', description = '', } = lineDto;

    const distance = this.getDistance(coordinates);
    this.logger.log(`Calculated total length: ${distance} meters`);

    try {
      const line = await this.lineModel.create({
        name, time: new Date(),
        distance, coordinates,
        mode, description, project,
      });

      return line;
    } catch (error) {
      this.logger.error('Error creating line:', error);
      throw error;
    }
  }
}