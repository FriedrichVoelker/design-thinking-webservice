CREATE TABLE IF NOT EXISTS `orders` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`email` VARCHAR(255) NULL DEFAULT NULL,
	`amount` INT NULL,
	`date` DATETIME NULL,
	'accepted' TINYINT NULL,
	PRIMARY KEY (`id`),
)
COLLATE='utf8mb4_general_ci';