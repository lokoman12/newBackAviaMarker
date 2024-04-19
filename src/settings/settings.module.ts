import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import Group from 'src/db/models/group';
import Settings from 'src/db/models/settings';
import { ApiConfigModule } from 'src/config/config.module';
import User from 'src/db/models/user';


@Module({
  providers: [],
  imports: [ApiConfigModule, SequelizeModule.forFeature([User, Group, Settings])],
  controllers: [],
  exports: [],
})
export class SettingsModule { }