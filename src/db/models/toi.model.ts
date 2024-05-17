import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { curs } from 'src/utils/Curs';

export interface IToi {
  id: number;
  id_Sintez: number;
  Number: number;
  X: number;
  Y: number;
  H: number;
  Name: string;
  CRS: number;
  faza: number;
  Type: number;
}

@Table({ tableName: "toi" })
export default class Toi extends Model implements IToi {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: true,
  })
  id: number;
  @Column({
    type: DataType.SMALLINT,
    allowNull: true,
  })
  id_Sintez: number;
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  Number: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  X: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  Y: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  H: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  CRS: number;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  Name: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  faza: number;

  @Column({
    type: DataType.SMALLINT,
    allowNull: true,
  })
  Type: number;
}
