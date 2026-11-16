CREATE TABLE `content_versions` (
	`id` text PRIMARY KEY NOT NULL,
	`payload` text NOT NULL,
	`label` text NOT NULL,
	`created_at` text NOT NULL,
	`actor` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `content_workspace` (
	`id` integer PRIMARY KEY NOT NULL,
	`draft` text NOT NULL,
	`revision` integer NOT NULL,
	`published_id` text,
	`updated_at` text NOT NULL
);
