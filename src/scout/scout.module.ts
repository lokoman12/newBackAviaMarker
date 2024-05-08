import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import SCOUT from 'src/db/models/scout.model';
import { SCOUTController } from './scout.controller';


@Module({
  imports: [SequelizeModule.forFeature([SCOUT])],
  controllers: [SCOUTController],
  exports: [SequelizeModule],
})
export class ScoutModule {}