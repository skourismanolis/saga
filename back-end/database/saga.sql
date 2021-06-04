-- MySQL Script generated by MySQL Workbench
-- Wed May 26 01:24:46 2021
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';


CREATE DATABASE IF NOT EXISTS `saga` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `saga`;

-- -----------------------------------------------------
-- Table `saga`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `saga`.`user` (
  `idUser` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(72) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `surname` VARCHAR(45) NOT NULL,
  `verified` TINYINT NOT NULL,
  `plan` ENUM("Free", "Premium", "Host") NOT NULL,
  `picture` VARCHAR(45) NULL,
  PRIMARY KEY (`idUser`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `saga`.`payment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `saga`.`payment` (
  `idPayment` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `idUser` INT UNSIGNED NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `timestamp` TIMESTAMP NOT NULL,
  PRIMARY KEY (`idPayment`),
  CONSTRAINT `fk_payment_user1`
    FOREIGN KEY (`idUser`)
    REFERENCES `saga`.`user` (`idUser`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `saga`.`project`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `saga`.`project` (
  `idProject` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `picture` VARCHAR(45) NULL,
  `title` VARCHAR(255) NULL,
  PRIMARY KEY (`idProject`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `saga`.`label`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `saga`.`label` (
  `idLabel` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `idProject` INT UNSIGNED NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `color` VARCHAR(6) NOT NULL,
  PRIMARY KEY (`idLabel`),
  CONSTRAINT `fk_label_project1`
    FOREIGN KEY (`idProject`)
    REFERENCES `saga`.`project` (`idProject`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `saga`.`sprint`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `saga`.`sprint` (
  `idSprint` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `idProject` INT UNSIGNED NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `start` DATE NULL,
  `finish` DATE NULL,
  PRIMARY KEY (`idSprint`),
  CONSTRAINT `fk_sprint_project1`
    FOREIGN KEY (`idProject`)
    REFERENCES `saga`.`project` (`idProject`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `saga`.`epic`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `saga`.`epic` (
  `idEpic` INT NOT NULL,
  `idProject` INT UNSIGNED NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `start` DATE NULL,
  `deadline` DATE NULL,
  `description` TEXT NULL,
  PRIMARY KEY (`idEpic`),
  CONSTRAINT `fk_epic_project1`
    FOREIGN KEY (`idProject`)
    REFERENCES `saga`.`project` (`idProject`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `saga`.`column`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `saga`.`column` (
  `idColumn` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `idProject` INT UNSIGNED NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `order` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`idColumn`),
  CONSTRAINT `fk_column_project1`
    FOREIGN KEY (`idProject`)
    REFERENCES `saga`.`project` (`idProject`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `saga`.`issue`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `saga`.`issue` (
  `code` VARCHAR(45) NOT NULL,
  `idProject` INT UNSIGNED NOT NULL,
  `idEpic` INT NULL,
  `idLabel` INT UNSIGNED NULL,
  `idSprint` INT UNSIGNED NULL,
  `idColumn` INT UNSIGNED NULL,
  `title` VARCHAR(255) NULL,
  `category` ENUM("Story", "Task", "Bug") NULL,
  `points` INT NULL,
  `priority` ENUM("Very Low", "Low", "Neutral", "High", "Very High") NULL,
  `deadline` DATETIME NULL,
  `description` TEXT NULL,
  PRIMARY KEY (`code`),
  CONSTRAINT `fk_issue_label1`
    FOREIGN KEY (`idLabel`)
    REFERENCES `saga`.`label` (`idLabel`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_issue_sprint1`
    FOREIGN KEY (`idSprint`)
    REFERENCES `saga`.`sprint` (`idSprint`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_issue_epic1`
    FOREIGN KEY (`idEpic`)
    REFERENCES `saga`.`epic` (`idEpic`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_issue_project1`
    FOREIGN KEY (`idProject`)
    REFERENCES `saga`.`project` (`idProject`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_issue_column1`
    FOREIGN KEY (`idColumn`)
    REFERENCES `saga`.`column` (`idColumn`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `saga`.`comment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `saga`.`comment` (
  `idComment` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `idUser` INT UNSIGNED NOT NULL,
  `code` VARCHAR(45) NOT NULL,
  `content` TEXT NOT NULL,
  `timestamp` TIMESTAMP NOT NULL,
  PRIMARY KEY (`idComment`),
  CONSTRAINT `fk_comment_issue1`
    FOREIGN KEY (`code`)
    REFERENCES `saga`.`issue` (`code`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_comment_user1`
    FOREIGN KEY (`idUser`)
    REFERENCES `saga`.`user` (`idUser`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `saga`.`member`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `saga`.`member` (
  `idUser` INT UNSIGNED NOT NULL,
  `idProject` INT UNSIGNED NOT NULL,
  `role` ENUM("Admin", "Member") NOT NULL,
  PRIMARY KEY (`idUser`, `idProject`),
  CONSTRAINT `fk_user_has_project_user1`
    FOREIGN KEY (`idUser`)
    REFERENCES `saga`.`user` (`idUser`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_has_project_project1`
    FOREIGN KEY (`idProject`)
    REFERENCES `saga`.`project` (`idProject`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `saga`.`assignee`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `saga`.`assignee` (
  `code` VARCHAR(45) NOT NULL,
  `idUser` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`code`, `idUser`),
  CONSTRAINT `fk_issue_has_user_issue1`
    FOREIGN KEY (`code`)
    REFERENCES `saga`.`issue` (`code`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_issue_has_user_user1`
    FOREIGN KEY (`idUser`)
    REFERENCES `saga`.`user` (`idUser`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Insert User with id 0 and username "deleted"
-- -----------------------------------------------------
SET SESSION sql_mode='NO_AUTO_VALUE_ON_ZERO';
INSERT INTO `saga`.`user` (`idUser`, `username`, `email`, `password`, `name`, `surname`, `verified`, `plan`)
VALUES (0,'deleted', '', '', '', '', '1', 'Free');

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;