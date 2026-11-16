CREATE TABLE `account_codes` (
	`user_id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `account_code_unique` ON `account_codes` (`code`);