import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: "podhod" })
export class Podhod extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: true,
  })
  id: number;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  Name: string;
  @Column({
    type: DataType.INTEGER
  })
  id_f: number;
  @Column({
    type: DataType.INTEGER
  })
  Dal: number;
  @Column({
    type: DataType.INTEGER
  })
  time_sec: number;
  @Column({
    type: DataType.TINYINT
  })
  cvet: number;
  
}
