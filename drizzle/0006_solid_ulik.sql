CREATE TABLE `feedback_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`request_id` text NOT NULL,
	`payload_hash` text NOT NULL,
	`actor_kind` text NOT NULL,
	`actor_id` text NOT NULL,
	`actor_name` text,
	`kind` text NOT NULL,
	`category` text NOT NULL,
	`target_type` text NOT NULL,
	`target_id` text,
	`target_title` text NOT NULL,
	`snapshot` text NOT NULL,
	`bank_version` text NOT NULL,
	`message` text NOT NULL,
	`rating` integer,
	`status` text NOT NULL,
	`owner_note` text NOT NULL,
	`revision` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `feedback_once` ON `feedback_entries` (`actor_kind`,`actor_id`,`request_id`);--> statement-breakpoint
CREATE INDEX `feedback_inbox` ON `feedback_entries` (`kind`,`status`,`created_at`);--> statement-breakpoint
CREATE INDEX `feedback_sender` ON `feedback_entries` (`actor_kind`,`actor_id`,`created_at`);