import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import Group, { IGroup } from 'src/db/models/group';
import User, { IUser } from 'src/db/models/user';
import { CreateGroupDto, CreateUserDto, UpdateGroupDto, UpdateUserDto } from './user.dto';

@Injectable()
export class GroupService {
  private readonly logger = new Logger(GroupService.name);

  constructor(
    @InjectModel(User) private readonly usersModel: typeof User,
    @InjectModel(Group) private readonly groupModel: typeof Group
  ) {
    this.logger.log('Init controller');
  }

  async createGroup(groupDto: CreateGroupDto): Promise<IGroup> {
    const group = await this.groupModel.create(
      { ...groupDto, }
    );
    return group;
  }

  async findAllGroups(): Promise<Array<IGroup>> {
    this.logger.log('find all groups: ');
    return this.groupModel.findAll({ raw: true, });
  }

  async findGroupById(id: number): Promise<IGroup | null> {
    return this.groupModel.findOne({ raw: true, where: { id, }, });
  }

  async findUsersInGroup(groupId: number): Promise<Array<IUser>> {
    const users = await this.usersModel.findAll({
      raw: true,
      include: [
        {
          model: Group,
          attributes: ['id',],
          through: { attributes: [], },
          where: { id: groupId, }
        },
      ],
    });
    return users;
  }

  async updateGroup(
    id: number,
    updateGroupDto: UpdateGroupDto
  ): Promise<IGroup> {
    const group = await this.groupModel.findOne({
      where: { id, },
    });
    if (!group) {
      throw new BadRequestException(`Can not update group with id: ${id}!`);
    }
    await group.update(updateGroupDto);
    await group.reload();
    return group.get();
  }

  async removeGroup(id: number): Promise<void> {
    await this.groupModel.destroy(
      { where: { id, }, }
    )
  }
}