import { Table, Column, Model, DataType, PrimaryKey, Unique, AutoIncrement, AllowNull } from 'sequelize-typescript';

@Table({ tableName: 'meteo_history' })
export default class MeteoHistory extends Model {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  id: number;

  @AllowNull(true)
  @Column({
    type: DataType.DATE,
  })
  time: Date;

  @Unique
  @Column({
    type: DataType.DOUBLE,
  })
  dTime: number;

  @AllowNull(false)
  @Column({
    type: DataType.TINYINT,
    allowNull: false,
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
