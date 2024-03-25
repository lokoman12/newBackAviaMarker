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
    type: DataType.STRING,
    allowNull: false,
  })
  coordinates: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;
}