import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import StandsGeo from 'src/db/models/standsGeo.model';
import { Public } from 'src/auth/decorators/public.decorator';
import { AccessTokenGuard } from 'src/auth/guards/access.token.guard';


@Controller('standGeo')
export class StandGeoController {
  private readonly logger = new Logger(StandGeoController.name);

  constructor(
    @InjectModel(StandsGeo) private readonly standsGeoModel: typeof StandsGeo,
  ) {
    this.logger.log('Init controller');
  }

  @Public()
  // @UseGuards(AccessTokenGuard)
  @Get()
  async getAllStandsGeo(): Promise<StandsGeo[]> {
    try {
      const standGeo = await this.standsGeoModel.findAll();
      return standGeo;
    } catch (error) {
      console.error('Error retrieving standsGeo:', error);
      throw error;
    }
  }
}