import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { curs } from 'src/Utils/Curs';

@Table({ tableName: "toi" })
export default class Toi extends Model {
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
  
  get CRSConverted(): number {
    return curs(this.getDataValue('CRS'));
  }
}
