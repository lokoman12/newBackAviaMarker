import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import Taxiway from 'src/db/models/taxiway.model';
import { TaxiwayController } from './taxiway.controller';
import TaxiwayService from './taxiway.service';


@Module({
  imports: [SequelizeModule.forFeature([Taxiway])],
  providers: [TaxiwayService,],
  controllers: [TaxiwayController,],
  exports: [TaxiwayService, SequelizeModule,],
})
export class TaxiwayModule { }