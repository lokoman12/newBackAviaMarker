import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { chain } from 'lodash';
import { PrismaService } from 'src/prisma/prisma.service';
import { auth } from '@prisma/client';

type RoleType = {
  name: string;
  persons: Array<auth>;
}

type RolesType = Array<RoleType>

@Injectable()
export class RoleService {
  private readonly logger = new Logger(RoleService.name);

  constructor(
    private readonly prismaService: PrismaService,
  ) {
    // this.logger.log('Init controller');
  }

  async findAllRoles(): Promise<RolesType> {
    this.logger.log('find all roles');
    const users: Array<auth> = await this.prismaService.auth.findMany();
    this.logger.log(`${users.length} users found`);

    const foundRoles = chain(users)
      .flatMap(user => user.roles.split(','))
      .uniqBy(it => it.toLowerCase())
      .value();

    const roles: RolesType = [];
    foundRoles.forEach(role => {
      const roleUsers = users.filter(user => user.roles?.includes(role));
      roles.push({ name: role, persons: roleUsers });
    })
    return roles;
  }

  async findRoleByName(roleName: string): Promise<boolean> {
    const users: Array<auth> = await this.prismaService.auth.findMany();
    const foundRoles = chain(users)
      .flatMap(user => user.roles.split(','))
      .uniq()
      .filter(it => it === roleName)
      .value();
    return foundRoles.length > 0;
  }

  private async getUsersByRole(rolename: string): Promise<Array<auth>> {
    let users = await this.prismaService.auth.findMany();
    users = users.filter(it => {
      const array = it.roles.split(',');
      return array.includes(rolename);
    });
    return users;
  }

  async findUsersInRole(rolename: string): Promise<Array<auth>> {
    return await this.getUsersByRole(rolename);
  }

  async updateRolename(currentRolename: string, newRolename: string): Promise<void> {
    const promises: Array<Promise<any>> = [];

    const roleUsers = await this.getUsersByRole(currentRolename);
    roleUsers.forEach(user => {
      const roles = user.roles
        .split(',')
        .map(it => it != currentRolename ? it : newRolename)
        .join(',');
      const promise = this.prismaService.auth.update({
        data: { roles, },
        where: {
          id: user.id,
        }
      });
      promises.push(promise);
    });

    await Promise.all(promises);
  }

  async removeRole(rolename: string): Promise<void> {
    const promises: Array<Promise<any>> = [];

    const roleUsers = await this.getUsersByRole(rolename);
    roleUsers.forEach(user => {
      const roles = user.roles
        .split(',')
        .filter(it => it != rolename)
        .join(',');
      const promise = this.prismaService.auth.update({
        data: { roles: roles, },
        where: {
          id: user.id,
        }
      });
      promises.push(promise);
    });

    await Promise.all(promises);
  }

}