import {
  Controller,
  Get,
  Logger,
  Post,
  Body,
  Param,
  Delete,
  Put
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateGroupDto, UpdateGroupDto } from 'src/user/user.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { GroupService } from './group.service';

@Controller('/groups')
export class GroupController {
  private readonly logger = new Logger(GroupController.name);

  constructor(
    private userService: UsersService,
    private groupService: GroupService
  ) { }

  @Public()
  @Post('/')
  async addNewGroup(@Body() dto: CreateGroupDto) {
    const group = await this.groupService.createGroup(dto);
    return group;
  }

  @Public()
  @Get('/')
  async getAllGroups() {
    const groups = await this.groupService.findAllGroups();
    return groups;
  }

  @Public()
  @Get('/:id')
  async getGroupById(@Param('id') id: number) {
    const group = await this.groupService.findGroupById(id);
    return group;
  }


  @Public()
  @Get('/:groupId/users')
  async getUsersInGroup(@Param('groupId') groupId: number) { 
    const users = await this.groupService.findUsersInGroup(groupId);
    return users;
  }

  @Public()
  @Put('/:id')
  async updateGroup(@Param('id') id: number, dto: UpdateGroupDto) {
    const group = await this.groupService.updateGroup(id, dto);
    return group;
  }

  @Public()
  @Delete('/:id')
  async removeGroupById(@Param('id') id: number) {
    const group = await this.groupService.removeGroup(id);
    return group;
  }

}
