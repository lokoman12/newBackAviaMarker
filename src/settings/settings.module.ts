import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import Group from 'src/db/models/group';
import Settings from 'src/db/models/settings';
import { ConfigModule } from 'src/config/user.module';
import User from 'src/db/models/user';


@Module({
  providers: [],
  imports: [ConfigModule, SequelizeModule.forFeature([User, Group, Settings])],
  controllers: [],
  exports: [],
})
export class SettingsModule { }