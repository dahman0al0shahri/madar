CREATE TABLE `madar_states` (
 `owner` text NOT NULL,
 `kind` text NOT NULL,
 `snapshot` text NOT NULL,
 `revision` integer NOT NULL,
 `request_id` text NOT NULL,
 `updated_at` text NOT NULL,
 PRIMARY KEY(`owner`, `kind`)
);
