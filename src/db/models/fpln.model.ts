import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'AODB' })
export default class FlightPlan extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  idSeq: number;
  @Column({
    type: DataType.STRING,
  })
  Registration: string;
  @Column({
    type: DataType.INTEGER,
  })
  LinkFlight: number;

  @Column({
    type: DataType.TINYINT,
  })
  TypePln: number;
  @Column({
    type: DataType.STRING,
  })
  Iatatype: string;
  @Column({
    type: DataType.STRING,
  })
  icaotype: string;
  @Column({
    type: DataType.STRING,
  })
  internalcode: string;
  @Column({
    type: DataType.STRING,
  })
  Airline: string;
  @Column({
    type: DataType.STRING,
  })
  Callsign: string;
  @Column({
    type: DataType.STRING,
  })
  CountryType: string;
  @Column({
    type: DataType.STRING,
  })
  CurrentStand: string;
  @Column({
    type: DataType.STRING,
  })
  DestinationAirport: string;
  @Column({
    type: DataType.STRING,
  })
  DisplayCode: string;
  @Column({
    type: DataType.STRING,
  })
  FlightNumber: string;
  @Column({
    type: DataType.STRING,
  })
  FlightStatus: string;
  @Column({
    type: DataType.STRING,
  })
  OriginAirport: string;
  @Column({
    type: DataType.STRING,
  })
  PreviousAirport: string;
  @Column({
    type: DataType.STRING,
  })
  Eta: string;
  @Column({
    type: DataType.STRING,
  })
  Etd: string;
  @Column({
    type: DataType.STRING,
  })
  Sta: string;
  @Column({
    type: DataType.STRING,
  })
  Std: string;
  @Column({
    type: DataType.STRING,
  })
  OnBlock: string;
  @Column({
    type: DataType.STRING,
  })
  NextAirport: string;
  @Column({
    type: DataType.STRING,
  })
  Runway: string;

  @Column({
    type: DataType.STRING,
  })
  ServiceTypeCode: string;

  @Column({
    type: DataType.STRING,
  })
  Stand: string;

  @Column({
    type: DataType.STRING,
  })
  StandBeginActual: string;
  @Column({
    type: DataType.STRING,
  })
  StandEndActual: string;
  @Column({
    type: DataType.STRING,
  })
  StandBeginPlan: string;

  @Column({
    type: DataType.STRING,
  })
  StandEndPlan: string;

  @Column({
    type: DataType.STRING,
  })
  Terminal: string;
  @Column({
    type: DataType.STRING,
  })
  TimeStamp: string;
  @Column({
    type: DataType.STRING,
  })
  GeneralLocation: string;
  @Column({
    type: DataType.DOUBLE,
  })
  t_obn: number;
}
