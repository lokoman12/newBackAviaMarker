import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'alarmAM' })
export default class AlaramAM extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
    type: DataType.FLOAT,
    allowNull: false,
  })
  speed: number;
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  time: Date;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  typeViolation: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;
}
