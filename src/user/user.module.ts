import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import Settings from 'src/db/models/settings';
import { ApiConfigModule } from 'src/config/config.module';
import { UsersService } from './user.service';
import User from 'src/db/models/user';
import { UserController } from './user.controller';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';


@Module({
  providers: [UsersService, GroupService,],
  imports: [ApiConfigModule, SequelizeModule.forFeature([User, Settings]),],
  controllers: [UserController, GroupController,],
  exports: [UsersService, GroupService,],
})
export class UsersModule { }