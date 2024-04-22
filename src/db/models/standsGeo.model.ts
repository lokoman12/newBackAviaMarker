import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'parks_web' })
export default class StandsGeo extends Model {
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
  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  geojson: object;
}
