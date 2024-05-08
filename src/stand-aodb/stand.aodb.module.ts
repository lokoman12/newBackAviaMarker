import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import Stands from 'src/db/models/stands.model';
import { StandController } from './stand.controller';


@Module({
  imports: [SequelizeModule.forFeature([Stands])],
  controllers: [StandController],
  exports: [SequelizeModule],
})
export class StandsModule {}