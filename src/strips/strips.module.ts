import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import Strips from 'src/db/models/strips.model';
import { StripsController } from './strips.controller';
import StripsService from './strips.service';


@Module({
  imports: [SequelizeModule.forFeature([Strips])],
  providers: [StripsService],
  controllers: [StripsController],
  exports: [StripsService, SequelizeModule],
})
export class StripsModule {}