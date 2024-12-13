import { Module } from '@nestjs/common';
import { ApiConfigModule } from 'src/config/config.module';
import { UsersService } from './user.service';
import { UserController } from './user.controller';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [ApiConfigModule, PrismaModule,],
  providers: [UsersService, GroupService,],
  controllers: [UserController, GroupController,],
  exports: [UsersService, GroupService,],
})
export class UsersModule { }