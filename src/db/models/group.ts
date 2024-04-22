import {
  Table
  , Column
  , Model
  , DataType
  , BelongsToMany
  , Scopes
  , Unique
  , AllowNull
} from 'sequelize-typescript';
import User, { IUser } from './user';
import UserGroup from './usergroup';


export interface IGroup {
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
@Table({ tableName: 'group', timestamps: false, })
export default class Group extends Model implements IGroup {
  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING, })
  name!: string;

  @Column({ type: DataType.STRING, })
  comment: string;

  @BelongsToMany(() => User, () => UserGroup)
  users?: User[];
}
