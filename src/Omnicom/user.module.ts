import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import SCOUT from 'src/db/models/scout.model';
import { OmnicomController } from './omnicom.controller';
import { ApiConfigModule } from 'src/config/config.module';


@Module({
  imports: [ApiConfigModule, SequelizeModule.forFeature([SCOUT])],
  controllers: [OmnicomController],
  exports: [SequelizeModule],
})
export class OmnicomModule {}