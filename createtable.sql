CREATE TABLE alarmAM (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lat FLOAT,
    lon FLOAT,
    time DATETIME,
    name VARCHAR(255)
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