import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import User, { IUser } from 'src/db/models/user';
import { chain } from 'lodash';

type GroupType = {
  name: string;
  persons: Array<IUser>;
}

type GroupsType = Array<GroupType>

@Injectable()
export class GroupService {
  private readonly logger = new Logger(GroupService.name);

  constructor(
    @InjectModel(User) private readonly usersModel: typeof User,
  ) {
    this.logger.log('Init controller');
  }

  async findAllGroups(): Promise<GroupsType> {
    this.logger.log('find all groups');
    const users: Array<IUser> = await this.usersModel.findAll({
      raw: true,
    });
    this.logger.log(`${users.length} users found`);

    const foundGroups = chain(users)
      .flatMap(user => user.groups.split(','))
      .uniqBy(it => it.toLowerCase())
      .value();

    const groups: GroupsType = [];
    foundGroups.forEach(group => {
      const groupUsers = users.filter(user => user.groups?.includes(group));
      groups.push({ name: group, persons: groupUsers });
    })
    return groups;
  }

  async findGroupByName(groupName: string): Promise<boolean> {
    const users: Array<IUser> = await this.usersModel.findAll({
      raw: true,
    });
    const foundGroups = chain(users)
      .flatMap(user => user.groups.split(','))
      .uniq()
      .filter(it => it === groupName)
      .value();
    return foundGroups.length > 0;
  }

  private async getUsersByGroup(groupname: string): Promise<Array<IUser>> {
    let users = await this.usersModel.findAll({
      raw: true,
    });
    users = users.filter(it => {
      const array = it.groups.split(',');
      return array.includes(groupname);
    });
    return users;
  }

  async findUsersInGroup(groupname: string): Promise<Array<IUser>> {
    return await this.getUsersByGroup(groupname);
  }

  async updateGroupname(currentGroupname: string, newGroupname: string): Promise<void> {
    const promises: Array<Promise<any>> = [];

    const groupUsers = await this.getUsersByGroup(currentGroupname);
    groupUsers.forEach(user => {
      const groups = user.groups
      .split(',')
      .map(it => it != currentGroupname ? it : newGroupname)
      .join(',');
       const promise = this.usersModel.update(
        { groups, },
        { where: {
          id: user.id,
        }}
      );
      promises.push(promise);
    });

    await Promise.all(promises);
  }

  async removeGroup(groupname: string): Promise<void> {
    const promises: Array<Promise<any>> = [];

    const groupUsers = await this.getUsersByGroup(groupname);
    groupUsers.forEach(user => {
      const groups = user.groups
      .split(',')
      .filter(it => it != groupname)
      .join(',');
       const promise = this.usersModel.update(
        { groups, },
        { where: {
          id: user.id,
        }}
      );
      promises.push(promise);
    });

    await Promise.all(promises);
  }

}