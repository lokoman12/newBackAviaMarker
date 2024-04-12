import { Table, Column, Model, DataType, Unique, Default, NotEmpty, PrimaryKey, AllowNull, BelongsToMany } from 'sequelize-typescript';
import Group from './group';
import UserGroup from './usergroup';


@Table({ tableName: 'auth' })
export default class User extends Model {
  @NotEmpty
  @PrimaryKey
  @Column({ type: DataType.INTEGER.UNSIGNED })
  id: number;

  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING, })
  login!: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, })
  password!: string;

  @Default(0)
  @AllowNull(false)
  @Column({ type: DataType.TINYINT, field: 'wrong_attempts', })
  wrongAttempts: number;

  @AllowNull(true)
  @Column({ type: DataType.DATE, field: 'last_seen'})
  lastSeen: Date;

  @BelongsToMany(() => Group, () => UserGroup)
  roles?: Group[];
};

// useBcrypt(User, {
//   field: 'password',
//   rounds: 12,
//   compare: 'authenticate',
// });

