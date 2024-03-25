import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'positionAM' })
export default class PositionAM extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  id: number;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lat: number;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lon: number;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;
}
