CREATE TABLE `questions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`statement` text NOT NULL,
	`answer` integer NOT NULL,
	`explanation` text NOT NULL,
	`category` text NOT NULL,
	`difficulty` text NOT NULL,
	`expansion` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `scores` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nickname` text NOT NULL,
	`score` integer NOT NULL,
	`total` integer NOT NULL,
	`streak` integer NOT NULL,
	`difficulty` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
