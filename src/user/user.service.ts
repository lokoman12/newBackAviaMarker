import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import User, { IUser } from 'src/db/models/user';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { Op } from 'sequelize';
import { omit } from 'lodash';
import { nonNull } from 'src/utils/common';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User) private readonly usersModel: typeof User,
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
      raw: false,
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
    });

    return user;
  }

  async findGroupsOfUser(userId: number): Promise<string> {
    const user = await this.usersModel.findOne({
      raw: true,
      where: { id: userId, },
    });
    return user.getDataValue('groups');
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto
  ): Promise<IUser> {
    let user = await this.usersModel.findOne({
      where: { id, },
    });
    if (!user) {
      throw new BadRequestException(`Can not update user with id: ${id}!`);
    }
    this.logger.log('Found user: ' + JSON.stringify(user));

    user = await user.update({ ...updateUserDto, });
    return user;
  }

  async removeUser(id: number): Promise<void> {
    await this.usersModel.destroy(
      { where: { id, }, }
    )
  }
}