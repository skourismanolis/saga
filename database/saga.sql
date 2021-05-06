-- --------------------------------------------------------
-- Διακομιστής:                  127.0.0.1
-- Έκδοση διακομιστή:            10.4.14-MariaDB - mariadb.org binary distribution
-- Λειτ. σύστημα διακομιστή:     Win64
-- HeidiSQL Έκδοση:              11.2.0.6213
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for saga
CREATE DATABASE IF NOT EXISTS `saga` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `saga`;

-- Dumping structure for πίνακας saga.asignee
CREATE TABLE IF NOT EXISTS `asignee` (
  `idUser` int(11) NOT NULL,
  `idIssue` int(11) NOT NULL,
  PRIMARY KEY (`idUser`,`idIssue`),
  KEY `fk_User_has_Issue_Issue1` (`idIssue`),
  CONSTRAINT `fk_User_has_Issue_Issue1` FOREIGN KEY (`idIssue`) REFERENCES `issue` (`idIssue`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_User_has_Issue_User1` FOREIGN KEY (`idUser`) REFERENCES `user` (`idUser`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for πίνακας saga.column
CREATE TABLE IF NOT EXISTS `column` (
  `idColumn` int(11) NOT NULL AUTO_INCREMENT,
  `idProject` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `order` int(11) DEFAULT NULL,
  PRIMARY KEY (`idColumn`),
  KEY `fk_Column_Project1` (`idProject`),
  CONSTRAINT `fk_Column_Project1` FOREIGN KEY (`idProject`) REFERENCES `project` (`idProject`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for πίνακας saga.comment
CREATE TABLE IF NOT EXISTS `comment` (
  `idComments` int(11) NOT NULL,
  `idIssue` int(11) NOT NULL,
  `content` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`idComments`),
  KEY `fk_Comments_Issue1` (`idIssue`),
  CONSTRAINT `fk_Comments_Issue1` FOREIGN KEY (`idIssue`) REFERENCES `issue` (`idIssue`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for πίνακας saga.epic
CREATE TABLE IF NOT EXISTS `epic` (
  `idEpic` int(11) NOT NULL AUTO_INCREMENT,
  `idProject` int(11) NOT NULL,
  `idSprint` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `start` date DEFAULT NULL,
  `deadline` date DEFAULT NULL,
  PRIMARY KEY (`idEpic`),
  KEY `fk_Epic_Project1` (`idProject`),
  KEY `fk_Epic_Sprint1` (`idSprint`),
  CONSTRAINT `fk_Epic_Project1` FOREIGN KEY (`idProject`) REFERENCES `project` (`idProject`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_Epic_Sprint1` FOREIGN KEY (`idSprint`) REFERENCES `sprint` (`idSprint`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for πίνακας saga.issue
CREATE TABLE IF NOT EXISTS `issue` (
  `idIssue` int(11) NOT NULL AUTO_INCREMENT,
  `code` int(11) unsigned NOT NULL,
  `idProject` int(11) NOT NULL,
  `idLabel` int(11) DEFAULT NULL,
  `idEpic` int(11) DEFAULT NULL,
  `idSprint` int(11) DEFAULT NULL,
  `idColumn` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `category` enum('Story','Task','Bug') NOT NULL DEFAULT 'Story',
  `points` int(10) unsigned NOT NULL DEFAULT 0,
  `priority` enum('Very Low','Low','Neutral','High','Very High') NOT NULL DEFAULT 'Neutral',
  `description` varchar(1000) DEFAULT NULL,
  `deadline` date DEFAULT NULL,
  PRIMARY KEY (`idIssue`),
  KEY `fk_Issue_Project1` (`idProject`),
  KEY `fk_Issue_Label1` (`idLabel`),
  KEY `fk_Issue_Epic1` (`idEpic`),
  KEY `fk_Issue_Sprint1` (`idSprint`),
  KEY `fk_Issue_Column1` (`idColumn`),
  CONSTRAINT `fk_Issue_Column1` FOREIGN KEY (`idColumn`) REFERENCES `column` (`idColumn`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_Issue_Epic1` FOREIGN KEY (`idEpic`) REFERENCES `epic` (`idEpic`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_Issue_Label1` FOREIGN KEY (`idLabel`) REFERENCES `label` (`idLabel`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_Issue_Project1` FOREIGN KEY (`idProject`) REFERENCES `project` (`idProject`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_Issue_Sprint1` FOREIGN KEY (`idSprint`) REFERENCES `sprint` (`idSprint`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for πίνακας saga.label
CREATE TABLE IF NOT EXISTS `label` (
  `idLabel` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `color` int(11) DEFAULT NULL,
  PRIMARY KEY (`idLabel`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for πίνακας saga.member
CREATE TABLE IF NOT EXISTS `member` (
  `idProject` int(11) NOT NULL,
  `idUser` int(11) NOT NULL,
  `role` enum('Admin','Member') DEFAULT NULL,
  PRIMARY KEY (`idProject`,`idUser`),
  KEY `fk_Project_has_User_User1` (`idUser`),
  CONSTRAINT `fk_Project_has_User_Project1` FOREIGN KEY (`idProject`) REFERENCES `project` (`idProject`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_Project_has_User_User1` FOREIGN KEY (`idUser`) REFERENCES `user` (`idUser`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for πίνακας saga.payment
CREATE TABLE IF NOT EXISTS `payment` (
  `idPayment` int(11) NOT NULL,
  `idUser` int(11) NOT NULL,
  `amount` int(11) unsigned NOT NULL,
  `datetime` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`idPayment`),
  KEY `fk_Payment_User1` (`idUser`),
  CONSTRAINT `fk_Payment_User1` FOREIGN KEY (`idUser`) REFERENCES `user` (`idUser`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for πίνακας saga.picture
CREATE TABLE IF NOT EXISTS `picture` (
  `idPicture` int(11) NOT NULL AUTO_INCREMENT,
  `path` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`idPicture`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for πίνακας saga.project
CREATE TABLE IF NOT EXISTS `project` (
  `idProject` int(11) NOT NULL AUTO_INCREMENT,
  `owner` int(11) NOT NULL,
  `idPicture` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `category` varchar(50) NOT NULL,
  PRIMARY KEY (`idProject`),
  KEY `fk_Project_User1` (`owner`),
  KEY `fk_Project_Picture1` (`idPicture`),
  CONSTRAINT `fk_Project_Picture1` FOREIGN KEY (`idPicture`) REFERENCES `picture` (`idPicture`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_Project_User1` FOREIGN KEY (`owner`) REFERENCES `user` (`idUser`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for πίνακας saga.sprint
CREATE TABLE IF NOT EXISTS `sprint` (
  `idSprint` int(11) NOT NULL AUTO_INCREMENT,
  `idProject` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `start` date DEFAULT NULL,
  `finish` date DEFAULT NULL,
  PRIMARY KEY (`idSprint`),
  KEY `fk_Sprint_Project1` (`idProject`),
  CONSTRAINT `fk_Sprint_Project1` FOREIGN KEY (`idProject`) REFERENCES `project` (`idProject`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for πίνακας saga.user
CREATE TABLE IF NOT EXISTS `user` (
  `idUser` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `profession` varchar(255) DEFAULT NULL,
  `birthDate` date DEFAULT NULL,
  `studies` varchar(255) DEFAULT NULL,
  `residence` varchar(255) DEFAULT NULL,
  `idPicture` int(11) DEFAULT NULL,
  `plan` enum('Free','Premium','Host') DEFAULT NULL,
  PRIMARY KEY (`idUser`),
  KEY `fk_User_Picture1` (`idPicture`),
  CONSTRAINT `fk_User_Picture1` FOREIGN KEY (`idPicture`) REFERENCES `picture` (`idPicture`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
