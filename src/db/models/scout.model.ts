import { Table, Column, Model, DataType, PrimaryKey } from 'sequelize-typescript';

@Table({ tableName: 'SCOUT' })
export default class Scout extends Model {
  @PrimaryKey
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
