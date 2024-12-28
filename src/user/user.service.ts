import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { auth } from '@prisma/client';
import { ENGINEER_LOGIN } from './const';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly prismaService: PrismaService,
  ) {
    this.logger.log('Init controller');
  }

  async createUser(userDto: CreateUserDto): Promise<auth> {
    this.logger.log('Create user: ' + userDto.username);
    const user = await this.prismaService.auth.create({
      data: { ...userDto, }
    });
    return user;
  }

  async findAllUsers(): Promise<Array<auth>> {
    this.logger.log('find all users: ');
    return this.prismaService.auth.findMany();
  }

  async findUserByLogin(username: string): Promise<auth | null> {
    this.logger.log('findUser: ', username);
    return this.prismaService.auth.findFirst({ where: { username, }, });
  }

  async findUserById(id: number): Promise<auth | null> {
    const user = await this.prismaService.auth.findFirst({
      where: { id, },
    });

    return user;
  }

  async findRolesOfUser(userId: number): Promise<string> {
    const user = await this.prismaService.auth.findFirst({
      where: { id: userId, },
    });
    return user?.roles || '';
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto
  ): Promise<auth> {
    let user = await this.prismaService.auth.findFirst({
      where: { id, },
    });
    if (!user) {
      throw new BadRequestException(`Can not update user with id: ${id}!`);
    }
    this.logger.log('Found user: ' + JSON.stringify(user));

    if (user.username === ENGINEER_LOGIN) {
      if (updateUserDto.password !== user.password) {
        updateUserDto = {
          password: updateUserDto.password,
        };
      } else {
        return user;
      }
    }

    await this.prismaService.auth.update({
      where: {
        id: user.id,
      },
      data: { ...updateUserDto, },
    });
    return user;
  }

  async removeUser(id: number): Promise<void> {
    const user = await this.findUserById(id);
    if (user.username === ENGINEER_LOGIN) {
      throw new BadRequestException(`Can not delete system user!`);
    }
    await this.prismaService.auth.delete(
      { where: { id, }, }
    )
  }
}