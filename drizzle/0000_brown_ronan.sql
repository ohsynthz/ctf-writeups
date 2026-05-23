CREATE TABLE `writeups` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`challenge` text NOT NULL,
	`ctf` text NOT NULL,
	`category` text NOT NULL,
	`tags` text NOT NULL,
	`difficulty` text NOT NULL,
	`content` text NOT NULL,
	`submitted_by` text,
	`created_at` text NOT NULL
);
