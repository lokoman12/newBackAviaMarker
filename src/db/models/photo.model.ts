import { Table, Column, Model, DataType, PrimaryKey } from 'sequelize-typescript';

@Table({ tableName: 'Photo' })
export default class Photo extends Model {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  id: number;

  @PrimaryKey
  @Column({
    type: DataType.SMALLINT,
  })
  type: number;

  mode: string;
  @Column({
    type: DataType.TEXT,
  })
  photo: string;
}
