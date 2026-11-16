CREATE TABLE `campaign_links` (
	`id` text PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`channel` text NOT NULL,
	`target` text NOT NULL,
	`active` integer DEFAULT 1 NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `activity_events` ADD `campaign_id` text;--> statement-breakpoint
CREATE INDEX `activity_campaign` ON `activity_events` (`campaign_id`,`received_at`);