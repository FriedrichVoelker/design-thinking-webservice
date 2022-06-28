CREATE TABLE IF NOT EXISTS `users` (
	`email` VARCHAR(255) NOT NULL,
	`name` VARCHAR(255) NULL DEFAULT '',
	`password` VARCHAR(255) NOT NULL,
	`created_at` DATETIME NULL,
	PRIMARY KEY (`email`)
)
COLLATE='utf8mb4_general_ci';