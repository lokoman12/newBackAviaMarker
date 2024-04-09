import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: "strips" })
export class Strips extends Model {
  @Column({ type: DataType.BIGINT, primaryKey: true, allowNull: false, defaultValue: 0 })
  flt_id: number;

  @Column({ type: DataType.SMALLINT, allowNull: false, defaultValue: 0 })
  type_fl: number;

  @Column({ type: DataType.STRING(10), allowNull: true })
  stripcolor: string | null;

  @Column({ type: DataType.STRING(50), allowNull: true })
  field1: string | null;

  @Column({ type: DataType.STRING(10), allowNull: true })
  field1_bg: string | null;

  @Column({ type: DataType.STRING(10), allowNull: true })
  field1_color: string | null;
  
  @Column({ type: DataType.STRING(50), allowNull: true })
  field2: string | null;

  @Column({ type: DataType.STRING(10), allowNull: true })
  field2_bg: string | null;

  @Column({ type: DataType.STRING(10), allowNull: true })
  field2_color: string | null;

  @Column({ type: DataType.STRING(50), allowNull: true })
  field3: string | null;

  @Column({ type: DataType.STRING(10), allowNull: true })
  field3_bg: string | null;

  @Column({ type: DataType.STRING(10), allowNull: true })
  field3_color: string | null;

  @Column({ type: DataType.STRING(50), allowNull: true })
  field4: string | null;

  @Column({ type: DataType.STRING(10), allowNull: true })
  field4_bg: string | null;

  @Column({ type: DataType.STRING(10), allowNull: true })
  field4_color: string | null;

  @Column({ type: DataType.STRING(50), allowNull: true })
  field5: string | null;

  @Column({ type: DataType.STRING(10), allowNull: true })
  field5_bg: string | null;

  @Column({ type: DataType.STRING(10), allowNull: true })
  field5_color: string | null;

  @Column({ type: DataType.STRING(50), allowNull: true })
  field6: string | null;

  @Column({ type: DataType.STRING(10), allowNull: true })
  field6_bg: string | null;

  @Column({ type: DataType.STRING(10), allowNull: true })
  field6_color: string | null;

  @Column({ type: DataType.STRING(50), allowNull: true })
  field7: string | null;

  @Column({ type: DataType.STRING(10), allowNull: true })
  field7_bg: string | null;

  @Column({ type: DataType.STRING(10), allowNull: true })
  field7_color: string | null;

  @Column({ type: DataType.STRING(50), allowNull: true })
  field8: string | null;

  @Column({ type: DataType.STRING(10), allowNull: true })
  field8_bg: string | null;

  @Column({ type: DataType.STRING(10), allowNull: true })
  field8_color: string | null;

  @Column({ type: DataType.STRING(50), allowNull: true })
  field9: string | null;

  @Column({ type: DataType.STRING(10), allowNull: true })
  field9_bg: string | null;

  @Column({ type: DataType.STRING(10), allowNull: true })
  field9_color: string | null;

  @Column({ type: DataType.STRING(50), allowNull: true })
  field10: string | null;

  @Column({ type: DataType.STRING(10), allowNull: true })
  field10_bg: string | null;

  @Column({ type: DataType.STRING(10), allowNull: true })
  field10_color: string | null;

  @Column({ type: DataType.STRING(50), allowNull: true })
  field11: string | null;

  @Column({ type: DataType.STRING(10), allowNull: true })
  field11_bg: string | null;

  @Column({ type: DataType.STRING(10), allowNull: true })
  field11_color: string | null;

  @Column({ type: DataType.STRING(50), allowNull: true })
  field12: string | null;

  @Column({ type: DataType.STRING(10), allowNull: true })
  field12_bg: string | null;

  @Column({ type: DataType.STRING(10), allowNull: true })
  field12_color: string | null;

  @Column({ type: DataType.STRING(50), allowNull: true })
  field13: string | null;

  @Column({ type: DataType.STRING(10), allowNull: true })
  field13_bg: string | null;

  @Column({ type: DataType.STRING(10), allowNull: true })
  field13_color: string | null;

  @Column({ type: DataType.FLOAT, allowNull: true })
  last_tu: number;
}
  
