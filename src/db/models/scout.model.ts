import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'SCOUT' })
export default class SCOUT extends Model {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  Serial: string;
  @Column({
    type: DataType.STRING,
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
