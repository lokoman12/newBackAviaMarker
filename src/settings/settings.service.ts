import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import Group from 'src/db/models/group';
import User from 'src/db/models/user';


@Injectable()
export class SettingsService {
  private readonly log = new Logger(SettingsService.name);

  constructor(
    @InjectModel(User) private readonly usersModel: typeof User,
    @InjectModel(Group) private readonly groupModel: typeof Group
  ) {
    this.log.log('Init controller');
  }

  async getPropertyByNameAndUser(propertyName: string, username: string): Promise<string | null> {
    return Promise.resolve(null);
  }

}