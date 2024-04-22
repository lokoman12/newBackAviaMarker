import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import Group from 'src/db/models/group';
import Settings from 'src/db/models/settings';
import { ApiConfigModule } from 'src/config/config.module';
import { UsersService } from './user.service';
import User from 'src/db/models/user';
import { UserController } from './user.controller';


@Module({
  providers: [UsersService],
  imports: [ApiConfigModule, SequelizeModule.forFeature([User, Group, Settings])],
  controllers: [UserController,],
  exports: [UsersService],
})
export class UsersModule { }