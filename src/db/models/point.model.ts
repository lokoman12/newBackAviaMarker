import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

@Table({ tableName: 'Point' })
export default class Point extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  id: number;

  @Column({
    type: DataType.STRING,
  })
  name: string;

  @Column({
    type: DataType.DATE,
  })
  time: Date;

  @Column({
    type: DataType.FLOAT,
  })
  lat: number;
  @Column({
    type: DataType.FLOAT,
  })
  lon: number;

  @Column({
    type: DataType.INTEGER,
  })
  radius: number;
  @Column({
    type: DataType.STRING,
  })
  description: string;
  @Column({
    type: DataType.STRING,
  })
  project: string;
  @Column({
    type: DataType.STRING,
  })
  mode: string;
}
