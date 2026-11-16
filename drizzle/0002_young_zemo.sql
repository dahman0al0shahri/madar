CREATE TABLE `activity_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_id` text NOT NULL,
	`actor_kind` text NOT NULL,
	`actor_id` text NOT NULL,
	`actor_name` text,
	`event_type` text NOT NULL,
	`page` text NOT NULL,
	`lesson` text,
	`question` text,
	`value` text,
	`client_at` text NOT NULL,
	`received_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `activity_event_unique` ON `activity_events` (`event_id`);--> statement-breakpoint
CREATE INDEX `activity_received` ON `activity_events` (`received_at`);--> statement-breakpoint
CREATE INDEX `activity_actor` ON `activity_events` (`actor_kind`,`actor_id`,`id`);--> statement-breakpoint
CREATE TABLE `activity_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`expires_at` integer NOT NULL
);
