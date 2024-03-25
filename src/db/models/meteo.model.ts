import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'METEO_RECV' })
export default class Meteo extends Model {
  @Column({
    type: DataType.DOUBLE,
    primaryKey: true,
    autoIncrement: true,
  })
  dTime: number;
  @Column({
    type: DataType.TINYINT,
    allowNull: false,
  })
  id_vpp: number;
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id_grp: number;
  @Column({
    type: DataType.STRING,
  })
  Data: string;
}
