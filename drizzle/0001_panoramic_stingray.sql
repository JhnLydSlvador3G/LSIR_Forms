ALTER TABLE "academic_load" DROP CONSTRAINT "academic_load_info_required_when_not_draft_chk";--> statement-breakpoint
ALTER TABLE "academic_load" ADD COLUMN "form_status" "form_status" DEFAULT 'Draft';--> statement-breakpoint
ALTER TABLE "academic_load" DROP COLUMN "is_draft";--> statement-breakpoint
ALTER TABLE "academic_load" ADD CONSTRAINT "academic_load_info_required_when_not_draft_chk" CHECK ("academic_load"."form_status" = 'Draft' OR ("academic_load"."year_level" IS NOT NULL AND
                "academic_load"."total_units" IS NOT NULL AND
                "academic_load"."semester" IS NOT NULL));