CREATE TABLE "faculty_submission" (
	"faculty_submission_id" serial PRIMARY KEY NOT NULL,
	"faculty_id" integer NOT NULL,
	"submission_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "president_attestation" DROP CONSTRAINT "president_attestation_info_required_when_not_draft_chk";--> statement-breakpoint
ALTER TABLE "curriculum" DROP CONSTRAINT "curriculum_submission_id_submission_submission_id_fk";
--> statement-breakpoint
ALTER TABLE "program_information" DROP CONSTRAINT "program_information_submission_id_submission_submission_id_fk";
--> statement-breakpoint
ALTER TABLE "fees" DROP CONSTRAINT "fees_financial_report_id_financial_report_financial_report_id_fk";
--> statement-breakpoint
ALTER TABLE "block_section" DROP CONSTRAINT "block_section_submission_id_submission_submission_id_fk";
--> statement-breakpoint
ALTER TABLE "enrollment_statistics" DROP CONSTRAINT "enrollment_statistics_submission_id_submission_submission_id_fk";
--> statement-breakpoint
DROP INDEX "curriculum_submission_id_idx";--> statement-breakpoint
ALTER TABLE "dean_attestation" ALTER COLUMN "form_status" SET DEFAULT 'Draft'::"public"."form_status";--> statement-breakpoint
ALTER TABLE "dean_attestation" ALTER COLUMN "form_status" SET DATA TYPE "public"."form_status" USING "form_status"::"public"."form_status";--> statement-breakpoint
ALTER TABLE "dean_attestation" ALTER COLUMN "form_status" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "block_section" ALTER COLUMN "submission_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "enrollment_statistics" ALTER COLUMN "submission_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "curriculum" ADD COLUMN "program_information_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "fees" ADD COLUMN "year_level_report_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "faculty_submission" ADD CONSTRAINT "faculty_submission_faculty_id_faculty_faculty_id_fk" FOREIGN KEY ("faculty_id") REFERENCES "public"."faculty"("faculty_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faculty_submission" ADD CONSTRAINT "faculty_submission_submission_id_submission_submission_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submission"("submission_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "curriculum" ADD CONSTRAINT "curriculum_program_information_id_program_information_program_information_id_fk" FOREIGN KEY ("program_information_id") REFERENCES "public"."program_information"("program_information_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_information" ADD CONSTRAINT "program_information_submission_id_submission_submission_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submission"("submission_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fees" ADD CONSTRAINT "fees_year_level_report_id_year_level_report_year_level_report_id_fk" FOREIGN KEY ("year_level_report_id") REFERENCES "public"."year_level_report"("year_level_report_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "block_section" ADD CONSTRAINT "block_section_submission_id_submission_submission_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submission"("submission_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollment_statistics" ADD CONSTRAINT "enrollment_statistics_submission_id_submission_submission_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submission"("submission_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "curriculum_submission_id_idx" ON "curriculum" USING btree ("program_information_id");--> statement-breakpoint
ALTER TABLE "curriculum" DROP COLUMN "submission_id";--> statement-breakpoint
ALTER TABLE "fees" DROP COLUMN "financial_report_id";--> statement-breakpoint
ALTER TABLE "curriculum" ADD CONSTRAINT "curriculum_program_information_id_unique" UNIQUE("program_information_id");--> statement-breakpoint
ALTER TABLE "basic_law_course" ADD CONSTRAINT "basic_law_course_program_information_id_unique" UNIQUE("program_information_id");--> statement-breakpoint
ALTER TABLE "branch_operated" ADD CONSTRAINT "branch_operated_program_information_id_unique" UNIQUE("program_information_id");--> statement-breakpoint
ALTER TABLE "extension_class" ADD CONSTRAINT "extension_class_program_information_id_unique" UNIQUE("program_information_id");--> statement-breakpoint
ALTER TABLE "graduate_law_course" ADD CONSTRAINT "graduate_law_course_program_information_id_unique" UNIQUE("program_information_id");--> statement-breakpoint
ALTER TABLE "refresher_course" ADD CONSTRAINT "refresher_course_program_information_id_unique" UNIQUE("program_information_id");--> statement-breakpoint
ALTER TABLE "academic_calendar" ADD CONSTRAINT "academic_calendar_program_information_id_unique" UNIQUE("program_information_id");--> statement-breakpoint
ALTER TABLE "dean_attestation" ADD CONSTRAINT "dean_attestation_certification_id_unique" UNIQUE("certification_id");--> statement-breakpoint
ALTER TABLE "president_attestation" ADD CONSTRAINT "president_attestation_certification_id_unique" UNIQUE("certification_id");--> statement-breakpoint
ALTER TABLE "faculty_statistics" ADD CONSTRAINT "faculty_statistics_submission_id_unique" UNIQUE("submission_id");--> statement-breakpoint
ALTER TABLE "enrollment_statistics" ADD CONSTRAINT "enrollment_statistics_submission_id_unique" UNIQUE("submission_id");--> statement-breakpoint
ALTER TABLE "president_attestation" ADD CONSTRAINT "president_attestation_info_required_when_not_draft_chk" CHECK ("president_attestation"."form_status" = 'Draft' OR ("president_attestation"."printed_name" IS NOT NULL AND
                "president_attestation"."id_type" IS NOT NULL AND
                "president_attestation"."id_number" IS NOT NULL));