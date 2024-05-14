import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: "Point" })
export default class Point extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  time: Date;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  lat: number;
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  lon: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  radius: number;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;
}