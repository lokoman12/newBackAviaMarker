import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import SCOUT from 'src/db/models/scout.model';
import { OmnicomController } from './omnicom.controller';
import { ConfigModule } from 'src/config/user.module';


@Module({
  imports: [ConfigModule, SequelizeModule.forFeature([SCOUT])],
  controllers: [OmnicomController],
  exports: [SequelizeModule],
})
export class OmnicomModule {}