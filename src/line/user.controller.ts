import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import User from 'src/db/models/user.model';
import { Logger } from '@nestjs/common';

@Controller('users')
export class UserController {
  private readonly log = new Logger(UserController.name);

  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
  ) {
    this.log.log('Init User controller');
  }

  @Get()
  async getAllLines(): Promise<User[]> {
    try {
      const users = await this.userModel.findAll();
      console.log('Lines:', users);
      return users;
      // return [];
    } catch (error) {
      this.log.error('Error retrieving users:', error);
      throw error;
    }
  }
}