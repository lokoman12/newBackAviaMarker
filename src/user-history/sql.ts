import { DATE_TIME_FORMAT } from "src/auth/consts";
import { OnlyTablenameParamSqlType, InsertHistorySqlType, CurrentHistoryInfoSql } from "./types";
import dayjs from '../utils/dayjs';

export const DEFAULT_PART_SIZE = 10;

export const getCurrentStepByTimeSql = (tableName: string, nextId: number) =>
  `SELECT step FROM ${tableName} WHERE step = ${nextId} limit 1`;

export const getCurrentTimeByStepSql = (tableName: string, nextId: number) =>
  `SELECT time FROM ${tableName} WHERE step = ${nextId} limit 1`;

export const getHistorySql = (tableName: string, nextId: number) =>
  `SELECT * FROM ${tableName} WHERE step = ${nextId}`;

export const getHistorySqlBySteps = (tableName: string, startStep: number, finishStep: number) =>
`SELECT * FROM ${tableName} WHERE step BETWEEN ${startStep} AND ${finishStep} order by step`;

export const getHistorySqlAllRecords = (tableName: string) =>
`SELECT * FROM ${tableName} order by step`;

export const getHistoryInfoSql: OnlyTablenameParamSqlType = (tablename: string) =>
  `SELECT COUNT(*) AS allRecs, MIN(step) AS startId, MAX(step) AS endId FROM ${tablename}`;

export const getCurrentHistoryInfoSql: CurrentHistoryInfoSql = (tablename: string, step: number) =>
  `SELECT step as currentId, time as currentTime FROM ${tablename} where step = ${step}`;

export const deleteSql: OnlyTablenameParamSqlType = (tableName: string) => `TRUNCATE ${tableName};`;

// В нашей версии mysql не работают оконные (over partition) функции
// Потому, чтобы нумеровать строки с одинаковым временем, использую
// @id := if(...)
// Внешний select под insert'ом отбрасывает лишнюю колонку prevTime,
// нужную только для нумерования строк по группам одинакового времени
export const selectAndFilterInternal = (tableName: string, attributesList: string, timeStart: Date, timeEnd: Date) => `
SELECT 
    @id := if(@prev_time = time, @id, @id + 1) AS step,
    @prev_time := time AS prevTime, time,
    ${attributesList}
  FROM ${tableName}
  , (select @id := 0, @prev_time := null) AS t
  WHERE time <= '${dayjs.utc(timeEnd).format(DATE_TIME_FORMAT)}'
    AND time >= '${dayjs.utc(timeStart).format(DATE_TIME_FORMAT)}'
  ORDER BY time
`;

export const toiHistoryAttributes = 'coordinates, Name, curs, alt, faza, Number, type, formular';
export const insertToiHistorySql: InsertHistorySqlType = (baseTableName: string, recordTableName: string, timeStart: Date, timeEnd: Date) => `INSERT INTO ${recordTableName} (
    step, time, 
    ${toiHistoryAttributes}
  )
  SELECT 	
  step, time, 
  ${toiHistoryAttributes}
FROM (${selectAndFilterInternal(baseTableName, toiHistoryAttributes, timeStart, timeEnd)}) history_record`;

export const omnicomHistoryAttributes = 'Serial, GarNum, t_obn, Lat, Lon, Speed, Course';
export const insertOmnicomHistorySql: InsertHistorySqlType = (baseTbleName: string, recordTableName: string, timeStart: Date, timeEnd: Date) => `INSERT INTO ${recordTableName} (
    step, time, 
    ${omnicomHistoryAttributes}
  )
  SELECT 	
  step, time, 
  ${omnicomHistoryAttributes}
FROM (${selectAndFilterInternal(baseTbleName, omnicomHistoryAttributes, timeStart, timeEnd)}) history_record`;

export const meteoHistoryAttributes = 'dTime, id_vpp, id_grp, Data';
export const insertMeteoHistorySql: InsertHistorySqlType = (baseTableName: string, recordTableName: string, timeStart: Date, timeEnd: Date) => `INSERT INTO ${recordTableName} (
    step, time, 
    ${meteoHistoryAttributes}
  )
  SELECT 	
  step, time, 
  ${meteoHistoryAttributes}
FROM (${selectAndFilterInternal(baseTableName, meteoHistoryAttributes, timeStart, timeEnd)}) history_record`;

export const standsHistoryAttributes = 'id_st, calls_arr, calls_dep, close';
export const insertStandsHistorySql: InsertHistorySqlType = (baseTableName: string, recordTableName: string, timeStart: Date, timeEnd: Date) => `INSERT INTO ${recordTableName} (
    step, time, 
    ${standsHistoryAttributes}
  )
  SELECT 	
  step, time, 
  ${standsHistoryAttributes}
FROM (${selectAndFilterInternal(baseTableName, standsHistoryAttributes, timeStart, timeEnd)}) history_record`;

export const aznbHistoryAttributes = 'Id_Tr, B, L, H, trs_adress, V_grd, PA';
export const insertAznbHistorySql: InsertHistorySqlType = (baseTableName: string, recordTableName: string, timeStart: Date, timeEnd: Date) => `INSERT INTO ${recordTableName} (
    step, time, 
    ${aznbHistoryAttributes}
  )
  SELECT 	
  step, time, 
  ${aznbHistoryAttributes}
FROM (${selectAndFilterInternal(baseTableName, aznbHistoryAttributes, timeStart, timeEnd)}) history_record`;

