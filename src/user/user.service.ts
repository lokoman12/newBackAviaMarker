import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import Group, { IGroup } from 'src/db/models/group';
import User, { IUser } from 'src/db/models/user';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { Op } from 'sequelize';
import { omit } from 'lodash';
import UserGroup from 'src/db/models/usergroup';
import { nonNull } from 'src/utils/common';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User) private readonly usersModel: typeof User,
    @InjectModel(Group) private readonly groupModel: typeof Group,
    @InjectModel(Group) private readonly userGroupModel: typeof UserGroup
  ) {
    this.logger.log('Init controller');
  }

  async createUser(userDto: CreateUserDto): Promise<IUser> {
    this.logger.log('Create user: ' + userDto.username);
    const user = await this.usersModel.create(
      { ...userDto, }
    );
    return user;
  }

  async findAllUsers(): Promise<Array<IUser>> {
    this.logger.log('find all users: ');
    return this.usersModel.findAll({
      nest: true,
      raw: true,
      include: [
        {
          model: Group,
          // attributes: ['id',],
          through: { attributes: [], },
        },
      ],
    });
  }

  async findUserByLogin(username: string): Promise<IUser | null> {
    this.logger.log('findUser: ', username);
    return this.usersModel.findOne({ raw: true, where: { username, }, });
  }

  async findUserById(id: number): Promise<IUser | null> {
    const user = await this.usersModel.findOne({
      nest: true,
      where: { id, },
      include: [
        {
          model: Group,
          through: { attributes: [], },
        },
      ],
    });

    // if (user.get('id') === 2) {
    //   this.log.log('Update user with roles');
    //   await user.update({
    //     roles: [
    //       {
    //         "id": 1,
    //         "name": "director",
    //         "comment": null
    //       },
    //       {
    //         "id": 2,
    //         "name": "engineer",
    //         "comment": null
    //       },
    //     ],
    //   });
    // }
    return user;
  }

  async findGroupsOfUser(userId: number): Promise<Array<IUser>> {
    const groups = await this.usersModel.findAll({
      raw: true,
      where: { id: userId, },
      include: [
        {
          model: Group,
          attributes: ['id',],
          through: { attributes: [], },
        },
      ],
    });
    return groups;
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto
  ): Promise<IUser> {
    const user = await this.usersModel.findOne({
      where: { id, },
      include: [
        {
          model: Group,
        },
      ],
    });
    if (!user) {
      throw new BadRequestException(`Can not update user with id: ${id}!`);
    }
    this.logger.log('Found user: ' + JSON.stringify(user));

    const data = { ...omit(updateUserDto, ['roleIds']) };
    if (nonNull(updateUserDto.roleIds)) {
      const groupIds = updateUserDto.roleIds.split(',');
      const groups = await this.groupModel.findAll({
        where: {
          id: {
            [Op.in]: groupIds,
          },
        },
      });
      data['roles'] = groups;
      await user.$set('roles', groups);
    }

    await user.update({ ...data, });

    return user;
  }

  async removeUser(id: number): Promise<void> {
    await this.usersModel.destroy(
      { where: { id, }, }
    )
  }
}