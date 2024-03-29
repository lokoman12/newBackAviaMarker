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