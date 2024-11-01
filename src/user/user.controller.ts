import {
  Controller,
  Get,
  Logger,
  Body,
  Param,
  Delete,
  Put,
  Post,
  Patch,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto, UpdateUserDto } from 'src/user/user.dto';
import { GroupService } from './group.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('/users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private userService: UsersService,
    private groupService: GroupService,
  ) {}

  @Public()
  @ApiOperation({ summary: 'Получить список всех пользователей' })
  @ApiResponse({ status: 200, description: 'Возвращает всех пользователей' })
  @Get('/')
  async getAllUsers() {
    const users = await this.userService.findAllUsers();
    return users;
  }

  @Public()
  @ApiOperation({ summary: 'Вернуть пользователя по его идентификатору' })
  @ApiResponse({ status: 200, description: 'Возвращает пользователя по его идентификатору.' })
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
  @ApiOperation({ summary: 'Update user by id' })
  @ApiResponse({
    status: 200,
    description: 'User has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiBody({ type: UpdateUserDto })
  @Patch('/:id')
  async updateUser(@Param('id') id: number, @Body() dto: UpdateUserDto) {
    const user = await this.userService.updateUser(id, dto);
    return user;
  }
  
  @Public()
  @ApiOperation({ summary: 'Create user via POST' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @Post('/')
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    return user;
  }

  @Public()
  @ApiOperation({ summary: 'Delete user by id' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 400, description: 'Failed to delete user.' })
  @Delete('/:id')
  async removeUserById(@Param('id') id: number) {
    const user = await this.userService.removeUser(id);
    return user;
  }
}
