CREATE TABLE "president_assignment" (
	"president_assignment_id" serial PRIMARY KEY NOT NULL,
	"president_id" integer NOT NULL,
	"hei_id" integer NOT NULL,
	"start_date" date,
	"end_date" date,
	"form_status" "form_status" DEFAULT 'Draft'
);
--> statement-breakpoint
CREATE TABLE "law_school_info" (
	"law_school_info_id" serial PRIMARY KEY NOT NULL,
	"law_school_id" integer,
	"building" varchar,
	"street" varchar,
	"barangay" varchar,
	"district" varchar,
	"city" varchar,
	"province" varchar,
	"region" "region",
	"email" varchar,
	"telephone" varchar,
	"accreditation_status" varchar,
	"recognition_status" "law_school_program_classification",
	"accredication_status" "accreditation_classification",
	"created_at" date,
	"form_status" "form_status" DEFAULT 'Draft',
	CONSTRAINT "hei_id_required_when_not_draft_chk" CHECK ("law_school_info"."form_status" = 'Draft' OR ("law_school_info"."law_school_id" IS NOT NULL AND
                "law_school_info"."email" IS NOT NULL AND
                "law_school_info"."telephone" IS NOT NULL AND
                "law_school_info"."recognition_status" IS NOT NULL AND
                "law_school_info"."accreditation_status" IS NOT NULL AND
                "law_school_info"."building" IS NOT NULL AND
                "law_school_info"."street" IS NOT NULL AND
                "law_school_info"."barangay" IS NOT NULL AND
                "law_school_info"."district" IS NOT NULL AND
                "law_school_info"."city" IS NOT NULL AND
                "law_school_info"."region" IS NOT NULL AND
                "law_school_info"."province" IS NOT NULL))
);
--> statement-breakpoint
ALTER TABLE "basic_law_course" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "branch_operated" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "extension_class" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "graduate_law_course" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "refresher_course" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "basic_law_course" CASCADE;--> statement-breakpoint
DROP TABLE "branch_operated" CASCADE;--> statement-breakpoint
DROP TABLE "extension_class" CASCADE;--> statement-breakpoint
DROP TABLE "graduate_law_course" CASCADE;--> statement-breakpoint
DROP TABLE "refresher_course" CASCADE;--> statement-breakpoint
ALTER TABLE "faculty_statistics" DROP CONSTRAINT "faculty_statistics_submission_id_unique";--> statement-breakpoint
ALTER TABLE "enrollment_statistics" DROP CONSTRAINT "enrollment_statistics_submission_id_unique";--> statement-breakpoint
ALTER TABLE "president" DROP CONSTRAINT "hei_id_required_when_not_draft_chk";--> statement-breakpoint
ALTER TABLE "law_school" DROP CONSTRAINT "hei_id_required_when_not_draft_chk";--> statement-breakpoint
ALTER TABLE "law_school" DROP CONSTRAINT "doctorate_classification_required_when_doctorate_program_chk";--> statement-breakpoint
ALTER TABLE "program_information" DROP CONSTRAINT "program_information_required_when_not_draft_chk";--> statement-breakpoint
ALTER TABLE "president" DROP CONSTRAINT "president_hei_id_hei_hei_id_fk";
--> statement-breakpoint
ALTER TABLE "faculty_development" DROP CONSTRAINT "faculty_development_submission_id_submission_submission_id_fk";
--> statement-breakpoint
ALTER TABLE "faculty_statistics" DROP CONSTRAINT "faculty_statistics_submission_id_submission_submission_id_fk";
--> statement-breakpoint
ALTER TABLE "financial_report" DROP CONSTRAINT "financial_report_submission_id_submission_submission_id_fk";
--> statement-breakpoint
ALTER TABLE "block_section" DROP CONSTRAINT "block_section_submission_id_submission_submission_id_fk";
--> statement-breakpoint
ALTER TABLE "enrollment_statistics" DROP CONSTRAINT "enrollment_statistics_submission_id_submission_submission_id_fk";
--> statement-breakpoint
ALTER TABLE "faculty_training" DROP CONSTRAINT "faculty_training_submission_id_submission_submission_id_fk";
--> statement-breakpoint
DROP INDEX "faculty_development_submission_id_idx";--> statement-breakpoint
DROP INDEX "faculty_statistics_submission_id_idx";--> statement-breakpoint
DROP INDEX "financial_report_submission_id_idx";--> statement-breakpoint
DROP INDEX "block_section_submission_id_idx";--> statement-breakpoint
DROP INDEX "enrollment_statistics_submission_id_idx";--> statement-breakpoint
DROP INDEX "faculty_training_submission_id_idx";--> statement-breakpoint
ALTER TABLE "law_school" ALTER COLUMN "hei_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "hei" ADD COLUMN "created_at" date;--> statement-breakpoint
ALTER TABLE "program_information" ADD COLUMN "program_classification" "law_program_classification";--> statement-breakpoint
ALTER TABLE "program_information" ADD COLUMN "doctorate_classification" "doctorate_program_classification";--> statement-breakpoint
ALTER TABLE "faculty_development" ADD COLUMN "program_information_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "faculty_statistics" ADD COLUMN "program_information_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "financial_report" ADD COLUMN "program_information_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "block_section" ADD COLUMN "program_information_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "enrollment_statistics" ADD COLUMN "program_information_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "submission" ADD COLUMN "deanAssignment_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "submission" ADD COLUMN "president_assignment_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "submission" ADD COLUMN "registrar_assignment_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "faculty_training" ADD COLUMN "program_information_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "president_assignment" ADD CONSTRAINT "president_assignment_president_id_president_president_id_fk" FOREIGN KEY ("president_id") REFERENCES "public"."president"("president_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "president_assignment" ADD CONSTRAINT "president_assignment_hei_id_hei_hei_id_fk" FOREIGN KEY ("hei_id") REFERENCES "public"."hei"("hei_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "law_school_info" ADD CONSTRAINT "law_school_info_law_school_id_law_school_law_school_id_fk" FOREIGN KEY ("law_school_id") REFERENCES "public"."law_school"("law_school_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faculty_development" ADD CONSTRAINT "faculty_development_program_information_id_program_information_program_information_id_fk" FOREIGN KEY ("program_information_id") REFERENCES "public"."program_information"("program_information_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faculty_statistics" ADD CONSTRAINT "faculty_statistics_program_information_id_program_information_program_information_id_fk" FOREIGN KEY ("program_information_id") REFERENCES "public"."program_information"("program_information_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "financial_report" ADD CONSTRAINT "financial_report_program_information_id_program_information_program_information_id_fk" FOREIGN KEY ("program_information_id") REFERENCES "public"."program_information"("program_information_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "block_section" ADD CONSTRAINT "block_section_program_information_id_program_information_program_information_id_fk" FOREIGN KEY ("program_information_id") REFERENCES "public"."program_information"("program_information_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollment_statistics" ADD CONSTRAINT "enrollment_statistics_program_information_id_program_information_program_information_id_fk" FOREIGN KEY ("program_information_id") REFERENCES "public"."program_information"("program_information_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission" ADD CONSTRAINT "submission_deanAssignment_id_dean_assignment_assignment_id_fk" FOREIGN KEY ("deanAssignment_id") REFERENCES "public"."dean_assignment"("assignment_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission" ADD CONSTRAINT "submission_president_assignment_id_president_assignment_president_assignment_id_fk" FOREIGN KEY ("president_assignment_id") REFERENCES "public"."president_assignment"("president_assignment_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission" ADD CONSTRAINT "submission_registrar_assignment_id_registrar_assignment_assignment_id_fk" FOREIGN KEY ("registrar_assignment_id") REFERENCES "public"."registrar_assignment"("assignment_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faculty_training" ADD CONSTRAINT "faculty_training_program_information_id_program_information_program_information_id_fk" FOREIGN KEY ("program_information_id") REFERENCES "public"."program_information"("program_information_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "faculty_development_submission_id_idx" ON "faculty_development" USING btree ("program_information_id");--> statement-breakpoint
CREATE INDEX "faculty_statistics_submission_id_idx" ON "faculty_statistics" USING btree ("program_information_id");--> statement-breakpoint
CREATE INDEX "financial_report_submission_id_idx" ON "financial_report" USING btree ("program_information_id");--> statement-breakpoint
CREATE INDEX "block_section_submission_id_idx" ON "block_section" USING btree ("program_information_id");--> statement-breakpoint
CREATE INDEX "enrollment_statistics_submission_id_idx" ON "enrollment_statistics" USING btree ("program_information_id");--> statement-breakpoint
CREATE INDEX "faculty_training_submission_id_idx" ON "faculty_training" USING btree ("program_information_id");--> statement-breakpoint
ALTER TABLE "president" DROP COLUMN "hei_id";--> statement-breakpoint
ALTER TABLE "law_school" DROP COLUMN "building";--> statement-breakpoint
ALTER TABLE "law_school" DROP COLUMN "street";--> statement-breakpoint
ALTER TABLE "law_school" DROP COLUMN "barangay";--> statement-breakpoint
ALTER TABLE "law_school" DROP COLUMN "district";--> statement-breakpoint
ALTER TABLE "law_school" DROP COLUMN "city";--> statement-breakpoint
ALTER TABLE "law_school" DROP COLUMN "province";--> statement-breakpoint
ALTER TABLE "law_school" DROP COLUMN "region";--> statement-breakpoint
ALTER TABLE "law_school" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "law_school" DROP COLUMN "telephone";--> statement-breakpoint
ALTER TABLE "law_school" DROP COLUMN "accreditation_status";--> statement-breakpoint
ALTER TABLE "law_school" DROP COLUMN "program_classification";--> statement-breakpoint
ALTER TABLE "law_school" DROP COLUMN "doctorate_classification";--> statement-breakpoint
ALTER TABLE "law_school" DROP COLUMN "recognition_status";--> statement-breakpoint
ALTER TABLE "law_school" DROP COLUMN "accredication_status";--> statement-breakpoint
ALTER TABLE "law_school" DROP COLUMN "form_status";--> statement-breakpoint
ALTER TABLE "faculty_development" DROP COLUMN "submission_id";--> statement-breakpoint
ALTER TABLE "faculty_statistics" DROP COLUMN "submission_id";--> statement-breakpoint
ALTER TABLE "financial_report" DROP COLUMN "submission_id";--> statement-breakpoint
ALTER TABLE "block_section" DROP COLUMN "submission_id";--> statement-breakpoint
ALTER TABLE "enrollment_statistics" DROP COLUMN "submission_id";--> statement-breakpoint
ALTER TABLE "faculty_training" DROP COLUMN "submission_id";--> statement-breakpoint
ALTER TABLE "financial_report" ADD CONSTRAINT "financial_report_program_information_id_unique" UNIQUE("program_information_id");--> statement-breakpoint
ALTER TABLE "president" ADD CONSTRAINT "president_info_required_when_not_draft_chk" CHECK ("president"."form_status" = 'Draft' OR ("president"."first_name" IS NOT NULL AND
        "president"."last_name" IS NOT NULL AND
        "president"."telephone_number" IS NOT NULL));--> statement-breakpoint
ALTER TABLE "program_information" ADD CONSTRAINT "program_information_required_when_not_draft_chk" CHECK ("program_information"."form_status" = 'Draft' OR 
                ("program_information"."curricular_schedule" IS NOT NULL AND
                "program_information"."operating_schedule" IS NOT NULL AND
                "program_information"."program_classification" IS NOT NULL));