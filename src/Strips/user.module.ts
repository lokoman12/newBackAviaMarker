import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import Strips from 'src/db/models/strips.model';
import { StripsController } from './strips.controller';


@Module({
  imports: [SequelizeModule.forFeature([Strips])],
  controllers: [StripsController],
  exports: [SequelizeModule],
})
export class StripsModule {}