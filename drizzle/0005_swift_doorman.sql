CREATE TABLE `question_responses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`actor_kind` text NOT NULL,
	`actor_id` text NOT NULL,
	`session_id` text NOT NULL,
	`question` text NOT NULL,
	`fingerprint` text NOT NULL,
	`bank_version` text NOT NULL,
	`mode` text NOT NULL,
	`answer` integer NOT NULL,
	`correct` integer NOT NULL,
	`received_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `response_once` ON `question_responses` (`actor_kind`,`actor_id`,`session_id`,`question`);--> statement-breakpoint
CREATE INDEX `response_period` ON `question_responses` (`received_at`);--> statement-breakpoint
CREATE INDEX `response_item` ON `question_responses` (`question`,`fingerprint`,`mode`);--> statement-breakpoint
CREATE TABLE `question_reviews` (
	`question` text NOT NULL,
	`fingerprint` text NOT NULL,
	`status` text NOT NULL,
	`note` text NOT NULL,
	`checklist` text NOT NULL,
	`revision` integer NOT NULL,
	`updated_at` text NOT NULL,
	`actor` text NOT NULL,
	PRIMARY KEY(`question`, `fingerprint`)
);
