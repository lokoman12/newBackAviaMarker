import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import Scout from 'src/db/models/scout.model';
import { ScoutController } from './scout.controller';


@Module({
  imports: [SequelizeModule.forFeature([Scout])],
  controllers: [ScoutController],
  exports: [SequelizeModule],
})
export class ScoutModule {}