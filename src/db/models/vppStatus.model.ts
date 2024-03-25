import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'vpp' })
export class VppStatus extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;
  @Column({
    type: DataType.STRING,
  })
  vpp_name: string;
  @Column({
    type: DataType.STRING,
  })
  Name_T_left: string;

  @Column({
    type: DataType.STRING,
  })
  Name_T_right: string;

  @Column({
    type: DataType.STRING,
  })
  close_vpp: string;

  @Column({
    type: DataType.STRING,
  })
  airport: string;
  @Column({
    type: DataType.TINYINT,
  })
  RegimL: string;
  @Column({
    type: DataType.TINYINT,
  })
  RegimR: string;
}
