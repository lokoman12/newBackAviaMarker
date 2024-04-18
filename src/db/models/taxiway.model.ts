import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'taxiway' })
export class Taxiway extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true
  })
  id: number;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;
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
}
