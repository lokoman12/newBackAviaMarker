import { Module } from '@nestjs/common';
import { ApiConfigModule } from 'src/config/config.module';
import { UsersService } from './user.service';
import { UserController } from './user.controller';
import { RoleService } from './group.service';
import { GroupController } from './group.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [ApiConfigModule, PrismaModule,],
  providers: [UsersService, RoleService,],
  controllers: [UserController, GroupController,],
  exports: [UsersService, RoleService,],
})
export class UsersModule { }