import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, AllowNull } from 'sequelize-typescript';

@Table({ tableName: 'meteo_history' })
export default class MeteoHistory extends Model {
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
    type: DataType.DOUBLE,
    unique: true,
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
