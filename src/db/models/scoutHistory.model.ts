import { Column, Model, DataType, PrimaryKey, AutoIncrement, AllowNull } from 'sequelize-typescript';
import { Table } from "src/history/types";
import { IHistoryClientType } from './toiHistory.model';

export interface IOmnicomHistory extends IHistoryClientType {
  Serial: string;
  GarNum: string;
  t_obn: number;
  Lat: number;
  Lon: number;
  Speed: number;
  Course: number;
};

@Table({ tableName: 'omnicom_history' })
export default class OmnicomHistory extends Model implements OmnicomHistory {
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

  @Column({
    type: DataType.STRING(10),
  })
  Serial: string;

  @Column({
    type: DataType.STRING(20),
  })
  GarNum: string;

  @Column({
    type: DataType.DOUBLE,
  })
  t_obn: number;

  @Column({
    type: DataType.DOUBLE,
  })
  Lat: number;

  @Column({
    type: DataType.DOUBLE,
  })
  Lon: number;

  @Column({
    type: DataType.FLOAT,
  })
  Speed: number;

  @Column({
    type: DataType.FLOAT,
  })
  Course: number;
}
