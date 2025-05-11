CREATE TABLE `kick_bans` (
	`id` integer PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`action_by` text NOT NULL,
	`expires_at` integer,
	`type` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
