import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, AllowNull } from 'sequelize-typescript';

@Table({ tableName: 'METEO_RECV' })
export default class Meteo extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.DOUBLE,
  })
  dTime: number;

  @AllowNull(false)
  @Column({
    type: DataType.TINYINT,
  })
  id_vpp: number;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  id_grp: number;
  
  @Column({
    type: DataType.STRING,
  })
  Data: string;
}
