import { Position } from '@turf/turf';
import { Table, Column, Model, DataType } from 'sequelize-typescript';

export interface IToiHistory {
  id: number;
  id_Sintez: number;
  Number: number;
  X: number;
  Y: number;
  H: number;
  coordination?: Position;
  CRS: number;
  Name: string;
  faza: number;
  time?: Date;
  FP_Callsign?: string;
  FP_Stand?: string;
  FP_TypeAirCraft?: string;
  Source_ID: number;
  Speed: number;
  Type_of_Msg: number;
  airport_code: string;
  ata: string;
  regnum: string;
  taxi_out: string;
  tobtg: string;
  tow: string;  
}

export interface IToiHistoryClient {
  id: number;
  id_Sintez: number;
  Number: number;
  coordination: Position;
  CRS: number;
  Name: string;
  faza: number;
  time?: Date;
  FP_Callsign?: string;
  FP_Stand?: string;
  FP_TypeAirCraft?: string;
  Source_ID: number;
  Speed: number;
  Type_of_Msg: number;
  airport_code: string;
  ata: string;
  regnum: string;
  taxi_out: string;
  tobtg: string;
  tow: string;  
}

@Table({ tableName: "toi_history" })
export default class ToiHistory extends Model implements IToiHistory {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
  })
  id: number;

  @Column({
    type: DataType.SMALLINT,
    allowNull: false,
  })
  id_Sintez: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  Number: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  X: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  Y: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  H: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  CRS: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  Name: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  faza: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  time: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  FP_Callsign: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  FP_Stand: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  FP_TypeAirCraft: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  Source_ID: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  Speed: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  Type_of_Msg: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  airport_code: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  ata: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  regnum: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  taxi_out: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  tobtg: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  tow: string;
}
