import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'rdd' })
export default class RdStatus extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.INTEGER,
  })
  id_vpp: string;

  @Column({
    type: DataType.INTEGER,
  })
  id_rd: string;

  @Column({
    type: DataType.STRING,
  })
  name_rd: string;

  @Column({
    type: DataType.INTEGER,
  })
  close_rd: string;

  @Column({
    type: DataType.STRING,
  })
  airport: string;
}
