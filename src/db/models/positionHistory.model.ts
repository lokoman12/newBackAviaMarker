import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'position_history' })
export default class PositionHistory extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  id: number;
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  lat: number;
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  lon: number;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  speed: number;
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  time: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  status: string;
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  time_save: string;
}
