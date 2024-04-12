import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import Group from 'src/db/models/group';
import User from 'src/db/models/user';

@Injectable()
export class UsersService {
  private readonly log = new Logger(UsersService.name);

  constructor(
    @InjectModel(User) private readonly usersModel: typeof User,
    @InjectModel(Group) private readonly groupModel: typeof Group
  ) {
    this.log.log('Init controller');
  }

  async getUserByUsername(login: string): Promise<User | null> {
    return this.usersModel.findOne({ where: { login, }, });
  }

  async getUsersByGroupname(name: string): Promise<Array<User>> {
    const group = this.groupModel.findOne({
      where: { name, },
      include: [
        {
          model: User,
        },
      ],
    });
    return Promise.resolve([]);
  }
}