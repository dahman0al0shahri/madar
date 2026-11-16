CREATE TABLE `service_alerts` (
	`id` text PRIMARY KEY NOT NULL,
	`status` text NOT NULL,
	`occurrences` integer NOT NULL,
	`first_at` integer NOT NULL,
	`last_at` integer NOT NULL,
	`last_success` integer,
	`ack_at` integer
);
--> statement-breakpoint
CREATE TABLE `service_scan` (
	`id` integer PRIMARY KEY NOT NULL,
	`token` text NOT NULL,
	`started_at` integer NOT NULL,
	`finished_at` integer
);
--> statement-breakpoint
CREATE TABLE `video_checks` (
	`lesson` text PRIMARY KEY NOT NULL,
	`video` text NOT NULL,
	`status` text NOT NULL,
	`code` integer,
	`checked_at` integer NOT NULL
);
