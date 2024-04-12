import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import Group from 'src/db/models/group';
import Settings from 'src/db/models/settings';
import { ConfigModule } from 'src/config/user.module';
import { UsersService } from './user.service';
import User from 'src/db/models/user';


@Module({
  providers: [UsersService],
  imports: [ConfigModule, SequelizeModule.forFeature([User, Group, Settings])],
  controllers: [],
  exports: [UsersService],
})
export class UsersModule { }