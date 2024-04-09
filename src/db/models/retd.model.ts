import { Table, Column, Model, DataType } from 'sequelize-typescript';


@Table({ tableName: "retd" })
export class Retd extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: true,
  })
  id: number;
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id_formular: number;
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  RETD_TIME_1: number;
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  Type_RETD_1: number;
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  RETD_TIME_2: number;
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  TYPE_RETD_2: number;
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  RETD_TIME_3: number;
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  TYPE_RETD_3: number;
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  Disp: number;
  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  Time: number;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fp_arr_airport: string;
}
