import {
  Controller,
  Get,
  Logger,
  Post,
  UseGuards,
  Request,
  Body,
  Param,
  Delete,
  Put
} from '@nestjs/common';
import { UsersService } from './user.service';
import { IUser } from '../db/models/user';
import { AuthGuard } from '@nestjs/passport';
import { AuthDto, UpdateUserDto } from 'src/user/user.dto';
import { Public } from 'src/auth/consts';

@Controller('users')
export class UserController {
  private readonly log = new Logger(UserController.name);

  constructor(
    private userService: UsersService
  ) { }

  @Public()
  @Get('/groups')
  async getAllGroups() {
    const groups = await this.userService.findAllGroups();
    return groups;
  }

  @Public()
  @Get('/user-by-group')
  async getUserByGroup() {
    const groups = await this.userService.findUsersByGroupname('test');
    return groups;
  }

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
  @Put('/:id')
  async updateUser(@Param('id') id: number, dto: UpdateUserDto) {
    const user = await this.userService.updateUser(id, dto);
    return user;
  }

  @Public()
  @Delete('/:id')
  async removeUserById(@Param('id') id: number) {
    const user = await this.userService.removeUser(id);
    return user;
  }

}
