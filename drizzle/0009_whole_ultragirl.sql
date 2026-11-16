CREATE TABLE `member_accounts` (
	`user_id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`created_at` integer NOT NULL,
	`last_seen` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `membership_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`request_id` text NOT NULL,
	`user_id` text NOT NULL,
	`product` text NOT NULL,
	`action` text NOT NULL,
	`actor_id` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `membership_request_unique` ON `membership_events` (`request_id`);--> statement-breakpoint
CREATE INDEX `membership_user_product` ON `membership_events` (`user_id`,`product`,`id`);