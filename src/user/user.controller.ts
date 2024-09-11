import {
  Controller,
  Get,
  Logger,
  Body,
  Param,
  Delete,
  Put,
  Post,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto, UpdateUserDto } from 'src/user/user.dto';
import { GroupService } from './group.service';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('/users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private userService: UsersService,
    private groupService: GroupService,
  ) {}

  @Public()
  @Get('/')
  async getAllUsers() {
    const users = await this.userService.findAllUsers();
    return users;
  }

  @Public()
  @Get('/:id')
  async getUserById(@Param('id') id: number) {
    const user = await this.userService.findUserById(id);
    return user;
  }

  @Public()
  @Get('/:userId/groups')
  async getGroupsOfUser(@Param('userId') userId: number) {
    const groups = await this.userService.findGroupsOfUser(userId);
    return groups;
  }

  @Public()
  @Put('/:id')
  async updateUser(@Param('id') id: number, @Body() dto: UpdateUserDto) {
    const user = await this.userService.updateUser(id, dto);
    return user;
  }
  
  @Public()
  @Post('/')
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    return user;
  }
  @Public()
  @Delete('/:id')
  async removeUserById(@Param('id') id: number) {
    const user = await this.userService.removeUser(id);
    return user;
  }
}
