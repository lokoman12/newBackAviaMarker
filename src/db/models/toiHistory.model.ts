import { Column, Model, DataType, PrimaryKey, AutoIncrement, AllowNull } from 'sequelize-typescript';
import { Table } from "src/history/types";

export type IHistoryClientType = {
  id: number;
  step: number;
  time: Date;
}

export interface IToiHistory extends IHistoryClientType {
  coordinates: LatLngType;
  Name?: string;
  curs: number;
  alt: number;
  faza: number;
  Number: number;
  type: number;
  formular: Array<FormularType>;
};

export type LatLngType = {
  lat: number;
  lon: number;
};

export type FormularType = {
  id: number;
  Source_ID: number;
  Type_of_Msg: number;
  FP_Callsign: string;
  FP_VPP_sign: string;
  poo: string;
  tobtg: string;
  FP_TypeAirCraft: string;
  tow: string;
  FP_stand: string;
  airport_code: string;
  taxi_out: string;
  ata: string;
  regnum: string;
  Speed: number;
};

// Свой Table вызывает Table модуля sequelize-typescript, но делает параметр tableName обязательным
@Table({ tableName: "toi_history" })
export default class ToiHistory extends Model implements IToiHistory {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  id: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  time: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  step: number;

  @AllowNull(false)
  @Column({
    type: DataType.JSON,
  })
  coordinates: LatLngType;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
  })
  Name: string;

  @AllowNull(false)
  @Column({
    type: DataType.FLOAT,
  })
  curs: number;

  @AllowNull(false)
  @Column({
    type: DataType.FLOAT,
  })
  alt: number;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  faza: number;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  Number: number;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  type: number;

  @AllowNull(false)
  @Column({
    type: DataType.JSON,
  })
  formular: Array<FormularType>;
}
