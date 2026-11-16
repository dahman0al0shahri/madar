CREATE TABLE `lesson_notes` (
	`user_id` text NOT NULL,
	`lesson` text NOT NULL,
	`note` text NOT NULL,
	`revision` integer NOT NULL,
	`updated_at` text NOT NULL,
	PRIMARY KEY(`user_id`, `lesson`)
);
