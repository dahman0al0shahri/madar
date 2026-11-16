CREATE TABLE `worksheet_saves` (
	`user_id` text NOT NULL,
	`lesson` text NOT NULL,
	`snapshot` text NOT NULL,
	`revision` integer NOT NULL,
	`request_id` text NOT NULL,
	`updated_at` text NOT NULL,
	PRIMARY KEY(`user_id`, `lesson`)
);
