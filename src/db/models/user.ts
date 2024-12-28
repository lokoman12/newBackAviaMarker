import { auth } from '@prisma/client';
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
  , AutoIncrement
} from 'sequelize-typescript';

export interface IGroup {
  name: string;
  users?: Array<auth>;
}

@Table({ tableName: 'auth' })
export default class User extends Model {
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

  // @BelongsToMany(() => Group, () => UserGroup)
  // roles?: Group[];

  @AllowNull(true)
  @Column({ type: DataType.STRING, })
  firstname?: string;

  @AllowNull(true)
  @Column({ type: DataType.STRING, })
  lastname?: string;

  @AllowNull(true)
  @Column({ type: DataType.STRING, })
  middlename?: string;

  @AllowNull(true)
  @Column({ type: DataType.STRING, })
  phone?: string;

  @AllowNull(true)
  @Column({ type: DataType.STRING, })
  email?: string;

  @AllowNull(true)
  @Column({ type: DataType.STRING, })
  position?: string;

  @AllowNull(true)
  @Column({ type: DataType.STRING, })
  department?: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, })
  roles: string;

};


