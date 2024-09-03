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
    allowNull: true,
  })
  time: Date;

  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  id_st: string;
  
  @Column({
    type: DataType.STRING,
  })
  sector: string;

  @Column({
    type: DataType.STRING,
  })
  reg_number: string;

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

  @Column({
    type: DataType.BIGINT,
  })
  fpl_id_arr: string;

  @Column({
    type: DataType.BIGINT,
  })
  fpl_id_dep: string;

  @Column({
    type: DataType.STRING,
  })
  terminal: string;

  @Column({
    type: DataType.STRING,
  })
  time_occup: string;

  @Column({
    type: DataType.STRING,
  })
  time_tow: string;
  
  @Column({
    type: DataType.DOUBLE,
  })
  last_tu: number;
}
