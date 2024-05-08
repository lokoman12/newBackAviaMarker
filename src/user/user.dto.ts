import { PartialType, OmitType, PickType, IntersectionType } from '@nestjs/mapped-types';
import { IGroup } from 'src/db/models/group';
import { IUser } from 'src/db/models/user';

export class UserDto implements IUser {
  id: number;
  username: string;
  password: string;
  wrongAttempts: number;
  lastSeen: Date;
  refreshToken?: string;
}

export class GroupDto implements IGroup {
  id: number;
  name: string;
  comment: string;
}

export class UpdateUserRoles {
  roleIds?: string;
}

export class CreateUserDto extends PickType(UserDto, ['username', 'password'] as const) { }

export class AuthDto extends PickType(UserDto, ['username', 'password'] as const) { };

export class UpdateUserDto extends IntersectionType(PartialType(UserDto), UpdateUserRoles) { }

export class CreateGroupDto extends PickType(GroupDto, ['name', 'comment'] as const) { }

export class UpdateGroupDto extends PartialType(OmitType(GroupDto, ['id'] as const)) { }
