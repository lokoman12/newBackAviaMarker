import { Controller, Post, Body, BadRequestException, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import StandsGeo from 'src/db/models/standsGeo.model';
import { Public } from 'src/auth/decorators/public.decorator';
import { ApiBody, ApiQuery } from '@nestjs/swagger';
import { log } from 'console';
import { QueryError } from 'sequelize';

@Controller('addStandGeo')
export class AddStandGeoController {
  private readonly logger = new Logger(AddStandGeoController.name);

  constructor(
    @InjectModel(StandsGeo) private readonly standsGeoModel: typeof StandsGeo,
  ) {
    this.logger.log('Init controller');
  }

  @ApiBody({
    required: false,
    type: Object,
  })

  @Public()
  // @UseGuards(AccessTokenGuard)

  @Post()
  async addStandGeo(
    @Query('name') name: string,
    @Query('lat') lat: number,
    @Query('lon') lon: number,
    @Body() body: { geojson: object }
  ): Promise<StandsGeo> {
    try {
      const geojsonForBd = body
      const newStandGeo = await this.standsGeoModel.create({
        name,
        lat,
        lon,
        geojson: geojsonForBd
      });

      return ;
    } catch (error) {
      console.error('Error adding standGeo:', error);
      throw error;
    }
  }
}
