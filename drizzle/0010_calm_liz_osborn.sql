ALTER TABLE "law_school" RENAME COLUMN "hei_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "law_school" DROP CONSTRAINT "law_school_hei_id_hei_info_hei_id_fk";
--> statement-breakpoint
ALTER TABLE "law_school" ALTER COLUMN "user_id" TYPE text USING ("user_id"::text);--> statement-breakpoint
UPDATE "law_school" ls
SET "user_id" = hi."user_id"
FROM "hei_info" hi
WHERE ls."user_id" = hi."hei_id"::text;--> statement-breakpoint
ALTER TABLE "law_school" ADD CONSTRAINT "law_school_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;