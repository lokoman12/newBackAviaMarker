import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ToiController } from './toi.controller';
import Toi from 'src/db/models/toi.model';
import Formular from 'src/db/models/Formular.model';
import { ConfigModule } from 'src/config/user.module';


@Module({
  imports: [ConfigModule, SequelizeModule.forFeature([Toi, Formular])],
  controllers: [ToiController],
  exports: [SequelizeModule],
})
export class ToiModule {}