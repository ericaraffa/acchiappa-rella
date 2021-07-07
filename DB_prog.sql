CREATE DATABASE IF NOT EXISTS archive_matches;
USE archive_matches;

/*Tables*/
DROP TABLE IF EXISTS `Player`;
CREATE TABLE `Player` (
    `id` char(11) NOT NULL,
    `pwd` char(50) NOT NULL,
PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `Match`;
CREATE TABLE `Match` (
	`id_match` INT NOT NULL AUTO_INCREMENT,
    `id_player` char(11) NOT NULL,
    `role` char(5) DEFAULT NULL,
PRIMARY KEY (`id_match`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `Game`;
CREATE TABLE `Game` (
	`id_match` INT NOT NULL AUTO_INCREMENT,
    `time` TIMESTAMP,
    `role` char(11) NOT NULL,
    `pos` int(5) NOT NULL,
    `turn` int(5) NOT NULL,
    `remaining_tokens` int(5) NOT NULL,
    `visible_pos` int(5) NULL,
PRIMARY KEY (`id_match`, `role`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `Player` VALUES 
	('Mirko','ciao'),('Peppa','tuoPadre'),('Gino','ginetti'),
	('Andrea','zioStefano'),('Arcibaldo','salvini!1'),('Graziella','Bella'),
    ('Gianfranca', 'vivaMaria');

INSERT INTO `Match` VALUES
	(1, 'Gianfranca','R'),(2, 'Peppa','P'),(3, 'Gino','P'),
	(4, 'Andrea','R'),(5, 'Arcibaldo','P'),(6, 'Graziella','P');
