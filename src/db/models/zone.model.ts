import { Table, Column, Model, DataType } from 'sequelize-typescript';


export interface Coordinate {
  latitude: number;
  longitude: number;
}
@Table({ tableName: 'zoneAM' })
export class ZoneAM extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  coordination: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;
}
