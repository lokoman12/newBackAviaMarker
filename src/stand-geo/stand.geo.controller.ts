import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
// import { AccessTokenGuard } from 'src/auth/guards/access.token.guard';
import StandGeoService from './stand.geo.service';
import { parks_web } from '@prisma/client';


@Controller('/standGeo')
export class StandGeoController {
  private readonly logger = new Logger(StandGeoController.name);

  constructor(
    private readonly standsGeoService: StandGeoService,
  ) {
    this.logger.log('Init controller');
  }

  @Public()
  // @UseGuards(AccessTokenGuard)
  @Post()
  async addStandGeo(
    @Query('name') name: string,
    @Query('lat') lat: number,
    @Query('lon') lon: number,
    @Body() body: { geojson: object }
  ): Promise<parks_web> {
    try {
      const newStandGeo = await this.standsGeoService.addActualData({
        name,
        lat,
        lon,
        geojson: body,
      });

      return newStandGeo;
    } catch (error) {
      console.error('Error adding standGeo:', error);
      throw error;
    }
  }

  @Public()
  // @UseGuards(AccessTokenGuard)
  @Get()
  async getAllStandsGeo(): Promise<Array<parks_web>> {
      return this.standsGeoService.getActualData();
  }
}