import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, AllowNull } from 'sequelize-typescript';

@Table({ tableName: 'stands_history' })
export default class StandsHistory extends Model {
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
    type: DataType.STRING,
    primaryKey: true,
  })
  id_st: string;
  

  @Column({
    type: DataType.STRING,
  })
  calls_arr: string;

  @Column({
    type: DataType.STRING,
  })
  calls_dep: string;

  @Column({
    type: DataType.TINYINT,
  })
  close: number;
}
