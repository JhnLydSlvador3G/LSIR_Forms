ALTER TABLE "program_information" DROP CONSTRAINT "program_information_required_when_not_draft_chk";--> statement-breakpoint
ALTER TABLE "program_information" ADD CONSTRAINT "program_information_required_when_not_draft_chk" CHECK ("program_information"."form_status" = 'Draft' OR 
                ("program_information"."curricular_schedule" IS NOT NULL AND
                "program_information"."operating_schedule" IS NOT NULL AND
                "program_information"."program_classification" IS NOT NULL));