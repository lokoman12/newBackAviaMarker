import { Table, Column, Model, DataType } from 'sequelize-typescript';


@Table({ tableName: "reta" })
export default class Reta extends Model {
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
  RETA_TIME: number;
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  Type_RETA: number;
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  ATA_TIME: number;
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  TYPE_ATA: number;
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
    type: DataType.TINYINT,
    allowNull: false,
  })
  Plan_Or_FlightPlan: number;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fp_dep_airport: string;
}
