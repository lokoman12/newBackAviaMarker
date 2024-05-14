import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';


import { LineController } from './line.controller';
import { SaveLineController } from './saveLine.controller';
import Line from 'src/db/models/line.model';



@Module({
  imports: [SequelizeModule.forFeature([Line])],
  controllers: [LineController, SaveLineController],
  exports: [SequelizeModule],
})
export class LineModule {}