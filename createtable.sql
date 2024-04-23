CREATE TABLE alarmAM (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lat FLOAT,
    lon FLOAT,
    spped FLOAT,
    name VARCHAR(255),
    typeViolation VARCHAR(255),
    time DATETIME,
);
CREATE TABLE positionAM (
    id INT PRIMARY KEY,
    lat FLOAT,
    lon FLOAT,
    name VARCHAR(255)
);
CREATE TABLE zoneAM (
    id INT AUTO_INCREMENT PRIMARY KEY,
    coordination JSON,
    name VARCHAR(255)
);
CREATE TABLE AODB (
IdSeq int(10) unsigned NOT NULL,
  Registration varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  LinkFlight int(10) unsigned DEFAULT NULL,
  TypePln tinyint(4) NOT NULL,
  Iatatype varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  Icaotype varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  Internalcode varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  Airline varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  Callsign varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  CountryType varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  CurrentStand varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  DestinationAirport varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  DisplayCode varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  FlightNumber varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  FlightStatus varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  OriginAirport varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  PreviousAirport varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  Eta varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  Etd varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  Sta varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  Std varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  OnBlock varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  NextAirport varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  Runway varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  ServiceTypeCode varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  Stand varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  StandBeginActual varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  StandEndActual varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  StandBeginPlan varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  StandEndPlan varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  Terminal varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  TimeStamp varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  GeneralLocation varchar(1500) COLLATE utf8_unicode_ci DEFAULT NULL,
  t_obn double DEFAULT NULL,
  PRIMARY KEY (IdSeq),
  KEY t_obn (t_obn)
);
CREATE TABLE SCOUT (
      Serial varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  GarNum varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  DateTime datetime DEFAULT NULL,
  t_obn double DEFAULT NULL,
  Lat double DEFAULT NULL,
  Lon double DEFAULT NULL,
  Speed float NOT NULL DEFAULT '0',
  Course float NOT NULL DEFAULT '0',
  DigIO smallint(6) DEFAULT '0',
  Adc0 smallint(6) DEFAULT '0',
  Adc1 smallint(6) DEFAULT '0',
  Stat0 smallint(6) DEFAULT '0',
  Stat1 smallint(6) DEFAULT '0',
  Data varchar(250) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (Serial),
  KEY GarNum (GarNum),
  KEY t_obn (t_obn)
);
CREATE TABLE taxiway (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE,
    lat FLOAT,
    lon FLOAT
);
CREATE TABLE parks_web (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    lat FLOAT,
    lon FLOAT,
    geojson JSON
);
-- Toi,
--  AlaramAM, 
--  PositionAM, 
--  ZoneAM, 
--  Meteo, 
--  FlightPlan, 
--  Formular, 
--  Strips, 
--  Reta, 
--  Retd