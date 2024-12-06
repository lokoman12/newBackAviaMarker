import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TaxiwayController } from './taxiway.controller';
import TaxiwayService from './taxiway.service';
import { PrismaModule } from 'src/prisma/prisma.module';


@Module({
  imports: [PrismaModule,],
  providers: [TaxiwayService,],
  controllers: [TaxiwayController,],
  exports: [TaxiwayService,],
})
export class TaxiwayModule { }