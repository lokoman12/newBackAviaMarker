import { Table, Column, Model, DataType, PrimaryKey, AllowNull } from 'sequelize-typescript';
import { curs } from 'src/utils/curs';

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
  @PrimaryKey
  @AllowNull(true)
  @Column({
    type: DataType.INTEGER,
  })
  id: number;

  @AllowNull(true)
  @Column({
    type: DataType.SMALLINT,
  })
  id_Sintez: number;

  @AllowNull(true)
  @Column({
    type: DataType.INTEGER,
  })
  Number: number;

  @AllowNull(true)
  @Column({
    type: DataType.INTEGER,
  })
  X: number;

  @AllowNull(true)
  @Column({
    type: DataType.INTEGER,
  })
  Y: number;

  @AllowNull(true)
  @Column({
    type: DataType.INTEGER,
  })
  H: number;

  @AllowNull(true)
  @Column({
    type: DataType.INTEGER,
  })
  CRS: number;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
  })
  Name: string;

  @AllowNull(true)
  @Column({
    type: DataType.INTEGER,
  })
  faza: number;

  @AllowNull(true)
  @Column({
    type: DataType.SMALLINT,
  })
  Type: number;
}
