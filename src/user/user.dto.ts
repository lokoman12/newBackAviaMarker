import { PartialType, OmitType, PickType } from '@nestjs/mapped-types';
import { IGroup } from 'src/db/models/group';
import User, { IUser } from 'src/db/models/user';

export class UserDto implements IUser {
  id: number;
  username: string;
  password: string;
  wrongAttempts: number;
  lastSeen: Date;
  roles?: IGroup[];
  refreshToken?: string;
}

export class CreateUserDto extends PickType(User, ['username', 'password'] as const) { }

export class AuthDto extends PickType(User, ['username', 'password'] as const) { };

export class UpdateUserDto extends PartialType(OmitType(User, ['id'] as const)) { }
