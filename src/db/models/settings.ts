import { Table, Column, Model, DataType, Unique, Default, NotEmpty, PrimaryKey, AllowNull } from 'sequelize-typescript';


@Table({ tableName: 'settings' })
export default class Settings extends Model {
  @NotEmpty
  @PrimaryKey
  @Column({ type: DataType.INTEGER.UNSIGNED })
  id: number;

  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING, })
  name!: string;

  @AllowNull(false)
  @Column({
    type: DataType.TEXT,
    get: function () {
      return JSON.parse(this.getDataValue('value'));
    },
    set: function (value) {
      this.setDataValue('value', JSON.stringify(value));
    }
  })
  value!: string;
  
  @AllowNull(true)
  @Column({ type: DataType.STRING, })
  username: string;

  @AllowNull(true)
  @Column({ type: DataType.STRING, })
  groupname: string;

};


