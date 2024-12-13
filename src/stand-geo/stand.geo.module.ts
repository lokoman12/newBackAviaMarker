import { Module } from '@nestjs/common';
import { StandGeoController } from './stand.geo.controller';
import StandGeoService from './stand.geo.service';
import { PrismaModule } from 'src/prisma/prisma.module';


@Module({
  imports: [PrismaModule,],
  providers: [StandGeoService,],
  controllers: [StandGeoController,],
  exports: [StandGeoService,],
})
export class StandGeoModule { }