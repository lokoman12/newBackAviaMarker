import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ToiController } from './toi.controller';
import Toi from 'src/db/models/toi.model';
import Formular from 'src/db/models/Formular.model';



@Module({
  imports: [SequelizeModule.forFeature([Toi, Formular])],
  controllers: [ToiController],
  exports: [SequelizeModule],
})
export class ToiModule {}