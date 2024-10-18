import { Logger } from '@nestjs/common';
import { Table, Column, Model, DataType, Unique, NotEmpty, PrimaryKey, AllowNull, AutoIncrement } from 'sequelize-typescript';

export interface ISetting {
  id: number;
  name: string;
  username: string;
  value: string;
  groupname: string;
}

@Table({ tableName: 'setting' })
export default class Settings extends Model implements ISetting {
  private readonly logger = new Logger(Settings.name);

  @NotEmpty
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER.UNSIGNED })
  id: number;

  @Unique("unique_user_group_property")
  @AllowNull(false)
  @Column({ type: DataType.STRING, })
  name!: string;

  @AllowNull(false)
  @Column({
    type: DataType.TEXT,
    // get: function () {
    //   console.log('get value from table: ' + this.getDataValue('value'));
    //   const strValue = JSON.parse(this.getDataValue('value'));
    //   try {
    //     return JSON.parse(strValue);
    //   } catch (e) {
    //     console.error(
    //       'Ошибка парсинга значения: ' + strValue + ' из таблицы для свойства: ' + this.getDataValue('name') + ' пользователя: ' + this.getDataValue('username')
    //     );
    //     return '{}';
    //   }
    // },
    // set: function (value) {
    //   this.setDataValue('value', JSON.stringify(value));
    // }
  })
  value!: string;

  @AllowNull(true)
  @Unique("unique_user_group_property")
  @Column({ type: DataType.STRING, })
  username: string;

  @AllowNull(true)
  @Unique("unique_user_group_property")
  @Column({ type: DataType.STRING, })
  groupname: string;

};


