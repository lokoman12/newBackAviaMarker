import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { chain } from 'lodash';
import { PrismaService } from 'src/prisma/prisma.service';
import { auth } from '@prisma/client';

type GroupType = {
  name: string;
  persons: Array<auth>;
}

type GroupsType = Array<GroupType>

@Injectable()
export class GroupService {
  private readonly logger = new Logger(GroupService.name);

  constructor(
    private readonly prismaService: PrismaService,
  ) {
    this.logger.log('Init controller');
  }

  async findAllGroups(): Promise<GroupsType> {
    this.logger.log('find all groups');
    const users: Array<auth> = await this.prismaService.auth.findMany();
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
    const users: Array<auth> = await this.prismaService.auth.findMany();
    const foundGroups = chain(users)
      .flatMap(user => user.groups.split(','))
      .uniq()
      .filter(it => it === groupName)
      .value();
    return foundGroups.length > 0;
  }

  private async getUsersByGroup(groupname: string): Promise<Array<auth>> {
    let users = await this.prismaService.auth.findMany();
    users = users.filter(it => {
      const array = it.groups.split(',');
      return array.includes(groupname);
    });
    return users;
  }

  async findUsersInGroup(groupname: string): Promise<Array<auth>> {
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
      const promise = this.prismaService.auth.update({
        data: { groups, },
        where: {
          id: user.id,
        }
      });
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
      const promise = this.prismaService.auth.update({
        data: { groups, },
        where: {
          id: user.id,
        }
      });
      promises.push(promise);
    });

    await Promise.all(promises);
  }

}