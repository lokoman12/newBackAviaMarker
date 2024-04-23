import {
  Table, Column, Model
  , ForeignKey
  , DataType
} from 'sequelize-typescript';
import User from './user';
import Group from './group';


@Table({ tableName: 'user_role', timestamps: false, })
export default class UserGroup extends Model {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER.UNSIGNED, })   
  userId!: number;

  @ForeignKey(() => Group)
  @Column({ type: DataType.INTEGER.UNSIGNED, })
  groupId!: number;
}
