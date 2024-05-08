import {
  Table
  , Column
  , Model
  , DataType
  , Unique
  , Default
  , NotEmpty
  , PrimaryKey
  , AllowNull
  , BelongsToMany
  , AutoIncrement
} from 'sequelize-typescript';
import Group, { IGroup } from './group';
import UserGroup from './usergroup';

export interface IUser {
  id: number;
  username: string;
  password: string;
  wrongAttempts: number;
  lastSeen: Date;
  roles?: IGroup[];
  refreshToken?: string;
}

@Table({ tableName: 'auth' })
export default class User extends Model implements IUser {
  @NotEmpty
  @AutoIncrement
  @PrimaryKey
  @Column({ type: DataType.INTEGER.UNSIGNED })
  id: number;

  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING, })
  username!: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, })
  password!: string;

  @Default(0)
  @AllowNull(false)
  @Column({ type: DataType.TINYINT, field: 'wrong_attempts', })
  wrongAttempts: number;

  @AllowNull(true)
  @Column({ type: DataType.DATE, field: 'last_seen' })
  lastSeen: Date;

  @BelongsToMany(() => Group, () => UserGroup)
  roles?: Group[];
};


