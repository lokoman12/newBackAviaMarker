import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'formular' })
export default class Formular extends Model {
  @Column({
    type: DataType.SMALLINT,
    primaryKey: true,
  })
  id: number;
  @Column({
    type: DataType.SMALLINT,
  })
  Source_ID: number;
  @Column({
    type: DataType.TINYINT,
  })
  Type_of_Msg: number;
  @Column({
    type: DataType.FLOAT,
  })
  H: number;
  @Column({
    type: DataType.FLOAT,
  })
  H_BAR: number;
  @Column({
    type: DataType.FLOAT,
  })
  Crs: number;
  @Column({
    type: DataType.STRING,
  })
  FP_Callsign: string;
  @Column({
    type: DataType.STRING,
  })
  tobtg: string;
  @Column({
    type: DataType.STRING,
  })
  FP_TypeAirCraft: string;
  @Column({
    type: DataType.STRING,
  })
  tow: string;
  @Column({
    type: DataType.STRING,
  })
  FP_stand: string;
  @Column({
    type: DataType.STRING,
  })
  airport_code: string;
  @Column({
    type: DataType.STRING,
  })
  taxi_out: string;
  @Column({
    type: DataType.STRING,
  })
  ata: string;
  @Column({
    type: DataType.STRING,
  })
  regnum: string;
  @Column({
    type: DataType.FLOAT,
  })
  speed: number;
}
