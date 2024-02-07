import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ToiController } from './toi.controller';
import { Toi } from 'src/db/models/toi.model';



@Module({
  imports: [SequelizeModule.forFeature([Toi])],
  controllers: [ToiController],
  exports: [SequelizeModule],
})
export class ToiModule {}