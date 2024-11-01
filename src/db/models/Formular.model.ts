import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { curs } from 'src/utils/curs';

export interface IFormular {
  id: number;
  Source_ID: number;
  Type_of_Msg: number;
  FP_Callsign: string;
  tobtg: string;
  FP_TypeAirCraft: string;
  tow: string;
  FP_stand: string;
  airport_code: string;
  taxi_out: string;
  ata: string;
  regnum: string;
  Speed: number;
  FP_VPP_sign: string;
  poo: string;
}

@Table({ tableName: 'formular' })
export default class Formular extends Model implements IFormular {
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
  Speed: number;
  @Column({
    type: DataType.STRING,
  })
  FP_VPP_sign: string;
  @Column({
    type: DataType.FLOAT,
  })
  poo: string;
}
