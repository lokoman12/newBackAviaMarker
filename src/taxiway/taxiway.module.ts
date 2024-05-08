import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import Taxiway from 'src/db/models/taxiway.model';
import { TaxiwayController } from './taxiway.controller';


@Module({
  imports: [SequelizeModule.forFeature([Taxiway])],
  controllers: [TaxiwayController],
  exports: [SequelizeModule],
})
export class TaxiwayModule {}