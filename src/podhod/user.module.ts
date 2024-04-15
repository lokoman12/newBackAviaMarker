import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Podhod } from 'src/db/models/podhod.model';
import { PodhodController } from './podhod.controller';






@Module({
  imports: [SequelizeModule.forFeature([Podhod])],
  controllers: [PodhodController],
  exports: [SequelizeModule],
})
export class PodhodModule {}