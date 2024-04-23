import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import Group, { IGroup } from 'src/db/models/group';
import User, { IUser } from 'src/db/models/user';
import { CreateUserDto, UpdateUserDto } from './user.dto';

@Injectable()
export class UsersService {
  private readonly log = new Logger(UsersService.name);

  constructor(
    @InjectModel(User) private readonly usersModel: typeof User,
    @InjectModel(Group) private readonly groupModel: typeof Group
  ) {
    this.log.log('Init controller');
  }

  async createUser(userDto: CreateUserDto): Promise<IUser> {
    this.log.log('Create user: ' + userDto.username);
    const user = this.usersModel.create(
      { ...userDto, }
    );
    return user;
  }

  async findAllGroups(): Promise<Array<IGroup>> {
    this.log.log('find all groups: ');
    return this.groupModel.findAll({ raw: true, });
  }

  async findAllUsers(): Promise<Array<IUser>> {
    this.log.log('find all users: ');
    return this.usersModel.findAll({ raw: true, });
  }

  async findUserByLogin(username: string): Promise<IUser | null> {
    this.log.log('findUser: ', username);
    return this.usersModel.findOne({ raw: true, where: { username, }, });
  }

  async findUserById(id: number): Promise<IUser | null> {
    return this.usersModel.findOne({ raw: true, where: { id, }, });
  }

  async findUsersByGroupname(name: string): Promise<Array<IUser>> {
    const group = this.groupModel.findOne({
      raw: true,
      where: { name, },
      include: [
        {
          model: User,
        },
      ],
    });
    return Promise.resolve([]);
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto
  ): Promise<IUser> {
    const user = await this.usersModel.findOne({
      where: { id, },
    });
    if (!user) {
      throw new BadRequestException(`Can not update user with id: ${id}!`);
    }
    user.update(updateUserDto);
    user.reload();
    return user.get();
  }

  async removeUser(id: number): Promise<void> {
    await this.usersModel.destroy(
      { where: { id, }, }
    )
  }
}