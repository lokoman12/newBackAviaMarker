import { DATE_TIME_FORMAT } from "src/auth/consts";
import { OnlyTablenameParamSqlType, InsertHistorySqlType, CurrentHistoryInfoSql } from "./types";
import dayjs from '../utils/dayjs';

export const getHistoryInfoSql: OnlyTablenameParamSqlType = (tablename: string) =>
  `SELECT COUNT(*) AS allRecs, MIN(step) AS startId, MAX(step) AS endIdFROM FROM ${tablename}`;

export const getCurrentHistoryInfoSql: CurrentHistoryInfoSql = (tablename: string, step: number) =>
  `SELECT step as currentId, time as currentTime FROM ${tablename} where step = ${step}`;

export const deleteSql: OnlyTablenameParamSqlType = (tableName: string) => `TRUNCATE ${tableName};`;

// В нашем mysql почему-то не работают оконные (over partition) функции
// Потому, чтобы нумеровать строки с одинаковым временем, использую
// @id := if(...)
// Внешний select под insert'ом отбрасывает лишнюю колонку prevTime,
// нужную только для нумерования строк по группам одинакового времени
export const ToiHistoryAttributes = 'coordinates, Name, curs, alt, faza, Number, type, formular';
export const insertToiHistorySql: InsertHistorySqlType = (tableName: string, timeStart: Date, timeEnd: Date) => `INSERT INTO ${tableName} (
    step, time, 
    ${ToiHistoryAttributes}
  )
  SELECT 	
  step, time, 
  ${ToiHistoryAttributes}
FROM (
  SELECT 
    @id := if(@prev_time = time, @id, @id + 1) AS step,
    @prev_time := time AS prevTime, time,
    ${ToiHistoryAttributes}
  FROM toi_history
  , (select @id := 0, @prev_time := null) AS t
  WHERE Name != '' AND Number != 0 
    AND time <= '${dayjs.utc(timeEnd).format(DATE_TIME_FORMAT)}'
    AND time >= '${dayjs.utc(timeStart).format(DATE_TIME_FORMAT)}'
  ORDER BY time
) history_record`;

export const OmnicomHistoryAttributes = 'Serial, GarNum, t_obn, Lat, Lon, Speed, Course';
export const insertOmnicomHistorySql: InsertHistorySqlType = (tableName: string, timeStart: Date, timeEnd: Date) => `INSERT INTO ${tableName} (
    step, time, 
    ${OmnicomHistoryAttributes}
  )
  SELECT 	
  step, time, 
  ${OmnicomHistoryAttributes}
FROM (
  SELECT 
    @id := if(@prev_time = time, @id, @id + 1) AS step,
    @prev_time := time AS prevTime, time,
    ${OmnicomHistoryAttributes}
  FROM omnicom_history
  , (select @id := 0, @prev_time := null) AS t
  WHERE time <= '${dayjs.utc(timeEnd).format(DATE_TIME_FORMAT)}'
    AND time >= '${dayjs.utc(timeStart).format(DATE_TIME_FORMAT)}'
  ORDER BY time
) history_record`;

export const MeteoHistoryAttributes = 'dTime, id_vpp, id_grp, Data';
export const insertMeteoHistorySql: InsertHistorySqlType = (tableName: string, timeStart: Date, timeEnd: Date) => `INSERT INTO ${tableName} (
    step, time, 
    ${MeteoHistoryAttributes}
  )
  SELECT 	
  step, time, 
  ${MeteoHistoryAttributes}
FROM (
  SELECT 
    @id := if(@prev_time = time, @id, @id + 1) AS step,
    @prev_time := time AS prevTime, time,
    ${MeteoHistoryAttributes}
  FROM meteo_history
  , (select @id := 0, @prev_time := null) AS t
  WHERE time <= '${dayjs.utc(timeEnd).format(DATE_TIME_FORMAT)}'
    AND time >= '${dayjs.utc(timeStart).format(DATE_TIME_FORMAT)}'
  ORDER BY time
) history_record`;
