ALTER TABLE `baseUsers` RENAME COLUMN "id" TO "base_user_id";--> statement-breakpoint
ALTER TABLE `baseUsers` RENAME COLUMN "email" TO "user_email";--> statement-breakpoint
ALTER TABLE `baseUsers` RENAME COLUMN "password" TO "user_password";