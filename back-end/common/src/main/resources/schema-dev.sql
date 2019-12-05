-- -----------------------------------------------------
-- Schema nftbay-dev
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `nftbay-dev` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ;
USE `nftbay-dev` ;

-- -----------------------------------------------------
-- Table `nftbay-dev`.`service`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nftbay-dev`.`service` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `desc` VARCHAR(1000) NULL,
  `contract` VARCHAR(12) NULL,
  `created` DATETIME NULL,
  `updated` DATETIME NULL,
  `deleted` DATETIME NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nftbay-dev`.`game_info`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nftbay-dev`.`game_info` (
  `id` BIGINT NOT NULL,
  `name` VARCHAR(100) NULL,
  `desc` VARCHAR(1000) NULL,
  `image_url` VARCHAR(1000) NULL,
  `created` DATETIME NULL,
  `updated` DATETIME NULL,
  `deleted` DATETIME NULL,
  `service_id` INT NOT NULL,
  PRIMARY KEY (`id`, `service_id`),
  INDEX `fk_game_info_service1_idx` (`service_id` ASC),
  CONSTRAINT `fk_game_info_service1`
    FOREIGN KEY (`service_id`)
    REFERENCES `nftbay-dev`.`service` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nftbay-dev`.`nft`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nftbay-dev`.`nft` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `created` DATETIME NULL,
  `updated` DATETIME NULL,
  `deleted` DATETIME NULL,
  `game_info_id` BIGINT NOT NULL,
  `item_tier` INT NULL,
  `item_upgrade` INT NULL,
  `item_grade` INT NULL,
  `servant_type` INT NULL,
  `servant_level` INT NULL,
  `monster_upgrade` INT NULL,
  `monster_level` INT NULL,
  `monster_grade` INT NULL,
  `nft_token_id` BIGINT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_nft_game_info1_idx` (`game_info_id` ASC),
  CONSTRAINT `fk_nft_game_info1`
    FOREIGN KEY (`game_info_id`)
    REFERENCES `nftbay-dev`.`game_info` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nftbay-dev`.`trade`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nftbay-dev`.`trade` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `idx` BIGINT NULL,
  `t_idx` BIGINT NULL,
  `owner` VARCHAR(45) NULL,
  `master` VARCHAR(45) NULL,
  `min_price` DOUBLE NULL,
  `max_price` DOUBLE NULL,
  `current_price` DOUBLE NULL,
  `state` VARCHAR(45) NULL,
  `buyer` VARCHAR(45) NULL,
  `bid_end_time` DATETIME NULL,
  `nft_type` VARCHAR(45) NULL,
  `transaction_id` VARCHAR(200) NULL,
  `created` DATETIME NULL,
  `updated` DATETIME NULL,
  `deleted` DATETIME NULL,
  `service_id` INT NOT NULL,
  `nft_id` BIGINT NOT NULL,
  PRIMARY KEY (`id`, `service_id`, `nft_id`),
  INDEX `idx_buy_price` (`t_idx` ASC),
  INDEX `idx_bid_price` (`min_price` ASC),
  INDEX `idx_accoun_name` (`owner` ASC),
  INDEX `fk_order_nft1_idx` (`nft_id` ASC),
  INDEX `fk_trade_service1_idx` (`service_id` ASC),
  CONSTRAINT `fk_order_nft1`
    FOREIGN KEY (`nft_id`)
    REFERENCES `nftbay-dev`.`nft` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_trade_service1`
    FOREIGN KEY (`service_id`)
    REFERENCES `nftbay-dev`.`service` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nftbay-dev`.`nft_ut_servant`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nftbay-dev`.`nft_ut_servant` (
  `id` BIGINT NOT NULL,
  `basic_str` BIGINT NOT NULL,
  `basic_dex` BIGINT NOT NULL,
  `basic_int` BIGINT NOT NULL,
  `plus_str` BIGINT NOT NULL,
  `plus_dex` BIGINT NOT NULL,
  `plus_int` BIGINT NOT NULL,
  `exp` BIGINT NULL,
  `stat_point` BIGINT NULL,
  `state` VARCHAR(45) NULL,
  `appear_head` INT NULL,
  `appear_hair` INT NULL,
  `appear_body` INT NULL,
  `appear_gender` INT NULL,
  `contract_table_id` BIGINT NULL,
  INDEX `fk_ut_servant_nft1_idx` (`id` ASC),
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_ut_servant_nft1`
    FOREIGN KEY (`id`)
    REFERENCES `nftbay-dev`.`nft` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nftbay-dev`.`nft_ut_monster`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nftbay-dev`.`nft_ut_monster` (
  `id` BIGINT NOT NULL,
  `basic_str` BIGINT NOT NULL,
  `basic_dex` BIGINT NOT NULL,
  `basic_int` BIGINT NOT NULL,
  `plus_str` BIGINT NOT NULL,
  `plus_dex` BIGINT NOT NULL,
  `plus_int` BIGINT NOT NULL,
  `type` INT NULL,
  `exp` BIGINT NULL,
  `grade` INT NULL,
  `upgrade` INT NULL,
  `state` VARCHAR(45) NULL,
  `contract_table_id` BIGINT NULL,
  INDEX `fk_ut_monster_nft1_idx` (`id` ASC),
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_ut_monster_nft1`
    FOREIGN KEY (`id`)
    REFERENCES `nftbay-dev`.`nft` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nftbay-dev`.`nft_ut_item`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nftbay-dev`.`nft_ut_item` (
  `id` BIGINT NOT NULL,
  `basic_str` BIGINT NOT NULL,
  `basic_dex` BIGINT NOT NULL,
  `basic_int` BIGINT NOT NULL,
  `plus_str` BIGINT NOT NULL,
  `plus_dex` BIGINT NOT NULL,
  `plus_int` BIGINT NOT NULL,
  `type` INT NULL,
  `tier` INT NULL,
  `job` INT NULL,
  `grade` INT NULL,
  `upgrade` INT NULL,
  `atk` INT NULL,
  `def` INT NULL,
  `state` VARCHAR(45) NULL,
  `main_status` INT NULL,
  `contract_table_id` BIGINT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_ut_item_nft1_idx` (`id` ASC),
  CONSTRAINT `fk_ut_item_nft1`
    FOREIGN KEY (`id`)
    REFERENCES `nftbay-dev`.`nft` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nftbay-dev`.`bidding_history`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nftbay-dev`.`bidding_history` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `bid_eos` FLOAT NULL,
  `bidder` VARCHAR(45) NULL,
  `state` VARCHAR(45) NULL,
  `created` DATETIME NULL,
  `updated` DATETIME NULL,
  `transaction_id` VARCHAR(200) NULL,
  `trade_id` BIGINT NOT NULL,
  PRIMARY KEY (`id`, `trade_id`),
  INDEX `fk_auction_trade1_idx` (`trade_id` ASC),
  CONSTRAINT `fk_auction_trade1`
    FOREIGN KEY (`trade_id`)
    REFERENCES `nftbay-dev`.`trade` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nftbay-dev`.`notice`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nftbay-dev`.`notice` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(100) NULL,
  `content` TEXT NULL,
  `type` VARCHAR(45) NULL,
  `state` VARCHAR(45) NULL,
  `created` DATETIME NULL,
  `updated` DATETIME NULL,
  `deleted` DATETIME NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nftbay-dev`.`block_index_state`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nftbay-dev`.`block_index_state` (
  `id` INT NOT NULL,
  `block_num` BIGINT NULL,
  `block_hash` VARCHAR(200) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nftbay-dev`.`ut_item`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nftbay-dev`.`ut_item` (
  `id` BIGINT NOT NULL,
  `tier` INT NULL,
  `tier_icon_url` VARCHAR(1000) NULL,
  `item_type` VARCHAR(45) NULL,
  `item_type_icon_url` VARCHAR(1000) NULL,
  `equip_class` VARCHAR(45) NULL,
  INDEX `fk_ut_item_game_info1_idx` (`id` ASC),
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_ut_item_game_info1`
    FOREIGN KEY (`id`)
    REFERENCES `nftbay-dev`.`game_info` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nftbay-dev`.`ut_monster`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nftbay-dev`.`ut_monster` (
  `id` BIGINT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_ut_monster_game_info1_idx` (`id` ASC),
  CONSTRAINT `fk_ut_monster_game_info1`
    FOREIGN KEY (`id`)
    REFERENCES `nftbay-dev`.`game_info` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nftbay-dev`.`ut_servant`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nftbay-dev`.`ut_servant` (
  `id` BIGINT NOT NULL,
  `job` VARCHAR(100) NULL,
  `job_icon_url` VARCHAR(1000) NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_ut_servant_game_info1`
    FOREIGN KEY (`id`)
    REFERENCES `nftbay-dev`.`game_info` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
