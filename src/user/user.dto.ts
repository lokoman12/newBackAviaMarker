import { PartialType, PickType, IntersectionType } from '@nestjs/mapped-types';
import { IUser, IGroup } from 'src/db/models/user';

export class UserDto implements IUser {
  id: number;
  username: string;
  password: string;
  wrongAttempts: number;
  lastSeen: Date;
  refreshToken?: string;

  firstname?: string;
  lastname?: string;
  middlename?: string;
  phone?: string;
  email?: string;
  position?: string;
  department?: string;

  groups: string;
}

export class GroupDto {
  name: string;
}

export class UpdateUserRoles {
  roleIds?: string;
}

export class CreateUserDto extends PickType(UserDto, ['username', 'password'] as const) { }

export class AuthDto extends PickType(UserDto, ['username', 'password'] as const) { };

export class UpdateUserDto extends IntersectionType(PartialType(UserDto), UpdateUserRoles) { }

export class CreateGroupDto extends GroupDto { }

export class UpdateGroupDto extends PartialType(GroupDto) { }
