import { Table, Column, Model, DataType, PrimaryKey, AllowNull, Default } from 'sequelize-typescript';

export interface IAznb {
  id: number;
  Id_Tr: string;
  trs_status: number;
  trs_adress: number;
  B: number;
  L: number;
  H: number;
  V_grd: number;
  PA: number;
}

@Table({ tableName: "azn_b" })
export default class Aznb extends Model implements IAznb {
  @PrimaryKey
  @AllowNull(true)
  @Column({
    type: DataType.INTEGER,
  })
  id: number;

  @AllowNull(true)
  @Default('')
  @Column({
    type: DataType.STRING(25),
  })
  Id_Tr: string;

  @AllowNull(true)
  @Default(0)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
  })
  trs_status: number;

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
