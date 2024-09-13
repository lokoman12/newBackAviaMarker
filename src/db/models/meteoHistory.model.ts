import { Column, Model, DataType, PrimaryKey, AutoIncrement, AllowNull } from 'sequelize-typescript';
import { Table } from "src/history/types";

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
