import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import SCOUT from 'src/db/models/scout.model';
import { OmnicomController } from './omnicom.controller';


@Module({
  imports: [SequelizeModule.forFeature([SCOUT])],
  controllers: [OmnicomController],
  exports: [SequelizeModule],
})
export class OmnicomModule {}