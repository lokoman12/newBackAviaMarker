import { Table, Column, Model, DataType } from 'sequelize-typescript';


@Table({ tableName: 'zoneAM' })
export class ZoneAM extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;
  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  coordination: object;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;
}
