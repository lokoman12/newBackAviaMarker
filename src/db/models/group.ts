import {
  Table
  , Column
  , Model
  , DataType
  , BelongsToMany
  , Scopes
  , Unique
  , AllowNull
  , AutoIncrement
  , NotEmpty
  , PrimaryKey
} from 'sequelize-typescript';
import User, { IUser } from './user';
import UserGroup from './usergroup';


export interface IGroup {
  id: number;
  name: string;
  comment: string;
  users?: IUser[];
}

@Scopes(() => ({
  users: {
    include: [
      {
        model: User,
      },
    ],
  },
}))
@Table({ tableName: 'role', timestamps: false, })
export default class Group extends Model implements IGroup {
  @NotEmpty
  @AutoIncrement
  @PrimaryKey
  @Column({ type: DataType.INTEGER.UNSIGNED })
  id: number;

  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING, })
  name!: string;

  @Column({ type: DataType.STRING, })
  comment: string;

  @BelongsToMany(() => User, () => UserGroup)
  users?: User[];
}
