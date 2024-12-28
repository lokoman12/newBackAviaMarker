import {
  Controller,
  Get,
  Logger,
  Body,
  Param,
  Delete,
  Patch
} from '@nestjs/common';
import { UsersService } from './user.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { RoleService } from './group.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateGroupDto } from './user.dto';

@Controller('/groups')
export class GroupController {
  private readonly logger = new Logger(GroupController.name);

  constructor(
    private userService: UsersService,
    private roleService: RoleService
  ) { }

  @Public()
  @Get('/')
  async getAllGroups() {
    const roles = await this.roleService.findAllRoles();
    return roles;
  }

  @Public()
  @Get('/:group')
  async checkGroupByName(@Param('group') group: string) {
    return await this.roleService.findRoleByName(group);
  }


  @Public()
  @Get('/:groupId/users')
  async getUsersInGroup(@Param('groupId') groupId: string) { 
    const users = await this.roleService.findUsersInRole(groupId);
    return users;
  }

  @Public()
  @Patch(':name')
  @ApiOperation({ summary: 'Rename group for all users' })
  @ApiResponse({ status: 200, description: 'Group renamed successfully.' })
  @ApiResponse({ status: 400, description: 'Failed to rename group' })
  async updateGroupByName(@Param('name') currentGroupname: string, @Body() dto: UpdateGroupDto) {
    const user = await this.roleService.updateRolename(currentGroupname, dto.name);
    return user;
  }

  @Public()
  @ApiOperation({ summary: 'Delete group by name from all users' })
  @ApiResponse({ status: 200, description: 'Group deleted successfully.' })
  @ApiResponse({ status: 400, description: 'Failed to delete group' })
  @Delete('/:groupname')
  async removeUserById(@Param('groupname') groupname: string) {
    this.logger.log(`Remove group ${groupname}`);
    const result = await this.roleService.removeRole(groupname);
    return result;
  }


}
