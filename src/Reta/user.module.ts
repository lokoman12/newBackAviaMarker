import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import Reta from 'src/db/models/reta.model';
import { RetaController } from './reta.controller';


@Module({
  imports: [SequelizeModule.forFeature([Reta])],
  controllers: [RetaController],
  exports: [SequelizeModule],
})
export class RetaModule {}