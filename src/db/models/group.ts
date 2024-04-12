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
import User from './user';
import UserGroup from './usergroup';


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
export default class Group extends Model {
  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING, })
  name!: string;

  @Column({ type: DataType.STRING, })
  comment: string;

  @BelongsToMany(() => User, () => UserGroup)
  users?: User[];
}
