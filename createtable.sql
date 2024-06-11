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
    name VARCHAR(255),
    lat FLOAT,
    lon FLOAT,
    speed FLOAT,
    status VARCHAR(255),
    time DateTime
);
CREATE TABLE position_history (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    lat FLOAT,
    lon FLOAT,
    speed FLOAT,
    status VARCHAR(255),
    time DateTime,
    time_save DateTime
);
CREATE TABLE zoneAM (
    id INT O_INCREMENT PRIMARY KEY,
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
CREATE TABLE auth (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  username varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  password varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  wrong_attempts smallint(5) unsigned NOT NULL,
  last_seen datetime DEFAULT NULL,
  createdAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  refresh_token varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY auth_UN (username)
);

CREATE TABLE setting (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  username varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '*',
  value varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  createdAt datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt datetime(3) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY setting_UN (name, username)
);

CREATE TABLE role (
  id int unsigned NOT NULL AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  comment varchar(255) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY name(name)
);

CREATE TABLE user_role (
  userId int unsigned NOT NULL,
  groupId int unsigned NOT NULL,
  PRIMARY KEY (userId, groupId),
  UNIQUE KEY user_group_groupId_userId_unique(userId, groupId),
  KEY user_role_FK_1(groupId),
  CONSTRAINT user_role_FK FOREIGN KEY (userId) REFERENCES auth(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT user_role_FK_1 FOREIGN KEY (groupId) REFERENCES role(id) ON DELETE CASCADE ON UPDATE CASCADE
)
CREATE TABLE Line (

)
CREATE TABLE Point (

)
CREATE TABLE Polygon (

)
CREATE TABLE Photo (

)