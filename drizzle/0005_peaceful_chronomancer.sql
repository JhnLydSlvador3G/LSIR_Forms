ALTER TABLE "president_attestation" ALTER COLUMN "form_status" SET DEFAULT 'Draft'::"public"."form_status";--> statement-breakpoint
ALTER TABLE "president_attestation" ALTER COLUMN "form_status" SET DATA TYPE "public"."form_status" USING "form_status"::"public"."form_status";--> statement-breakpoint
ALTER TABLE "president_attestation" ALTER COLUMN "form_status" DROP NOT NULL;