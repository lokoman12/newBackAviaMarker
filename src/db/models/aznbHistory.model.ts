import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, AllowNull, Default } from 'sequelize-typescript';

@Table({ tableName: "aznb_history" })
export default class AznbHistory extends Model {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  id: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  time: Date;

  @AllowNull(true)
  @Default(0)
  @Column({
    type: DataType.STRING(25),
  })
  Id_Tr: string;

  @AllowNull(true)
  @Default(0)
  @Column({
    type: DataType.DOUBLE,
  })
  B: number;

  @AllowNull(true)
  @Default(0)
  @Column({
    type: DataType.DOUBLE,
  })
  L: number;

  @AllowNull(true)
  @Default(0)
  @Column({
    type: DataType.DOUBLE,
  })
  H: number;

  @AllowNull(true)
  @Default(0)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
  })
  trs_adress: number;

  @AllowNull(true)
  @Default(0)
  @Column({
    type: DataType.DOUBLE,
  })
  V_grd: number;

  @AllowNull(true)
  @Default(0)
  @Column({
    type: DataType.TINYINT,
  })
  PA: number;
}
