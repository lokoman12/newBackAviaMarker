DROP TABLE IF EXISTS `meteo_history`;

CREATE TABLE IF NOT EXISTS 
  `meteo_history` (
    `id` int (11) NOT NULL AUTO_INCREMENT,
    `time` datetime (3) NOT NULL,
    `dTime` double NOT NULL,
    `id_vpp` tinyint (4) NOT NULL,
    `id_grp` int (11) NOT NULL,
    `Data` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `meteo_history_id_key` (`id`),
    KEY `time` (`time`),
    KEY `dTime` (`dTime`)
  );

DROP TABLE IF EXISTS `omnicom_history`;

CREATE TABLE IF NOT EXISTS 
  `omnicom_history` (
    `id` int (11) NOT NULL AUTO_INCREMENT,
    `time` double NOT NULL,
    `Serial` varchar(255) COLLATE utf8_bin NOT NULL,
    `GarNum` varchar(255) COLLATE utf8_bin DEFAULT NULL,
    `t_obn` double DEFAULT NULL,
    `Lat` double DEFAULT NULL,
    `Lon` double DEFAULT NULL,
    `Speed` float DEFAULT NULL,
    `Course` float DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `serial_uniq` (`Serial`),
    KEY `time` (`time`)
  );

DROP TABLE IF EXISTS `toi_history`;

CREATE TABLE IF NOT EXISTS
  `toi_history` (
    `id` int (11) NOT NULL AUTO_INCREMENT,
    `time` datetime DEFAULT NULL,
    `coordinates` json NOT NULL,
    `alt` float NOT NULL,
    `Name` varchar(255) DEFAULT NULL,
    `curs` float NOT NULL,
    `faza` int (11) NOT NULL,
    `Number` int (11) NOT NULL,
    `type` int (11) NOT NULL,
    `formular` json NOT NULL,
    PRIMARY KEY (`id`),
    KEY `time` (`time`)
  );

DROP TABLE IF EXISTS `stands_history`;

CREATE TABLE IF NOT EXISTS 
  `stands_history` (
    `id` int (11) NOT NULL AUTO_INCREMENT,
    `time` datetime DEFAULT NULL,
    `id_st` varchar(50) NOT NULL DEFAULT '',
    `calls_arr` varchar(50) DEFAULT NULL,
    `calls_dep` varchar(50) DEFAULT NULL,
    `close` tinyint (4) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `time` (`time`)
  );

DROP TABLE IF EXISTS `aznb_history`;

CREATE TABLE IF NOT EXISTS 
  `aznb_history` (
    `id` int (11) NOT NULL AUTO_INCREMENT,
    `time` datetime DEFAULT NULL,
    `Id_Tr` varchar(25) DEFAULT '',
    `trs_status` int (10) unsigned NOT NULL DEFAULT '0',
    `trs_adress` int(10) unsigned NOT NULL DEFAULT '0',
    `B` double NOT NULL DEFAULT '0',
    `L` double NOT NULL DEFAULT '0',
    `H` smallint (6) NOT NULL DEFAULT '0',
    `V_grd` double NOT NULL DEFAULT '0',
    `PA` tinyint (4) NOT NULL DEFAULT '0',
    PRIMARY KEY (`id`),
    KEY `time` (`time`)
  );

CREATE TABLE IF NOT EXISTS 
  `auth` (
    `id` int (10) unsigned NOT NULL AUTO_INCREMENT,
    `username` varchar(255) NOT NULL,
    `password` varchar(255) NOT NULL,
    `wrong_attempts` tinyint (4) NOT NULL DEFAULT '0',
    `last_seen` datetime DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `username` (`username`)
  );

CREATE TABLE IF NOT EXISTS 
  `role` (
    `id` int (10) unsigned NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `comment` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `name` (`name`)
  );

CREATE TABLE IF NOT EXISTS 
  `user_role` (
    `userId` int (10) unsigned NOT NULL,
    `groupId` int (10) unsigned NOT NULL,
    PRIMARY KEY (`userId`, `groupId`),
    UNIQUE KEY `user_role_userId_groupId_unique` (`userId`, `groupId`),
    KEY `groupId` (`groupId`),
    CONSTRAINT `user_role_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `auth` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `user_role_ibfk_2` FOREIGN KEY (`groupId`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
  );

CREATE TABLE IF NOT EXISTS 
  `setting` (
    `id` int (10) unsigned NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `value` text NOT NULL,
    `username` varchar(255) DEFAULT NULL,
    `groupname` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `name` (`name`)
  );