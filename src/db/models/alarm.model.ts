import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'alarmAM' })
export class AlaramAM extends Model {
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
  lat: number;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lon: number;
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  time: Date;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  zone: string;
}
