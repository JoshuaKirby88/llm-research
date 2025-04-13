CREATE TABLE `BlockingValue` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`value` text NOT NULL,
	`blockingVariableId` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`blockingVariableId`) REFERENCES `BlockingVariable`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `BlockingVariable` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`prompt` text,
	`researchId` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`researchId`) REFERENCES `Research`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Completion` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`content` text NOT NULL,
	`tokens` integer NOT NULL,
	`testId` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`testId`) REFERENCES `Test`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Contributor` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`count` integer NOT NULL,
	`userId` text NOT NULL,
	`researchId` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`researchId`) REFERENCES `Research`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `EvalPrompt` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`text` text NOT NULL,
	`researchId` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`researchId`) REFERENCES `Research`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `IndependentValue` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`value` text NOT NULL,
	`independentVariableId` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`independentVariableId`) REFERENCES `IndependentVariable`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `IndependentVariable` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`prompt` text,
	`researchId` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`researchId`) REFERENCES `Research`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Message` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`role` text NOT NULL,
	`content` text NOT NULL,
	`tokens` integer NOT NULL,
	`testId` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`testId`) REFERENCES `Test`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `MessagePrompt` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`role` text NOT NULL,
	`text` text NOT NULL,
	`researchId` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`researchId`) REFERENCES `Research`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Research` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`isCompleted` integer DEFAULT false,
	`userId` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ResearchResult` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`count` integer NOT NULL,
	`resultEnumId` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`resultEnumId`) REFERENCES `ResultEnum`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ResultEnum` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`value` text NOT NULL,
	`researchId` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`researchId`) REFERENCES `Research`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Test` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`resultEnumId` integer NOT NULL,
	`testBatchId` integer NOT NULL,
	`independentValueId` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`resultEnumId`) REFERENCES `ResultEnum`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`testBatchId`) REFERENCES `TestBatch`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`independentValueId`) REFERENCES `IndependentValue`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `TestBatch` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`count` integer NOT NULL,
	`contributorId` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`contributorId`) REFERENCES `Contributor`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `TestBatchResult` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`count` integer NOT NULL,
	`resultEnumId` integer NOT NULL,
	`testBatchId` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`resultEnumId`) REFERENCES `ResultEnum`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`testBatchId`) REFERENCES `TestBatch`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `TestToBlockingValue` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`testId` integer NOT NULL,
	`blockingValueId` integer NOT NULL,
	FOREIGN KEY (`testId`) REFERENCES `Test`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`blockingValueId`) REFERENCES `BlockingValue`(`id`) ON UPDATE no action ON DELETE no action
);
