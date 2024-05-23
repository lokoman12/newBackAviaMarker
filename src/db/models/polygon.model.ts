import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'Polygon' })
export default class Polygon extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
    type: DataType.STRING,
  })
  square: string;
  @Column({
    type: DataType.STRING,
  })
  coordinates: string;
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
  @Column({
    type: DataType.BLOB,
  })
  photo: Buffer;
}
