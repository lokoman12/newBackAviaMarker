import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import SCOUT from 'src/db/models/scout.model';
import { OmnicomController } from './omnicom.controller';
import { ApiConfigModule } from 'src/config/config.module';
import OmnicomService from './omnicom.service';


@Module({
  imports: [ApiConfigModule, SequelizeModule.forFeature([SCOUT])],
  providers: [OmnicomService,],
  controllers: [OmnicomController],
  exports: [SequelizeModule, OmnicomService],
})
export class OmnicomModule { }