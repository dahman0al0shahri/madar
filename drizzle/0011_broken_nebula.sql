CREATE TABLE `excel_study_events` (
	`user_id` text NOT NULL,
	`event_id` text NOT NULL,
	`kind` text NOT NULL,
	`lesson` text NOT NULL,
	`payload` text NOT NULL,
	`created_at` text NOT NULL,
	PRIMARY KEY(`user_id`, `event_id`)
);
--> statement-breakpoint
CREATE INDEX `excel_study_owner` ON `excel_study_events` (`user_id`,`created_at`);