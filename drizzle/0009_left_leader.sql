ALTER TABLE "hei" RENAME TO "hei_info";--> statement-breakpoint
ALTER TABLE "hei_info" DROP CONSTRAINT "address_required_when_not_draft_chk";--> statement-breakpoint
ALTER TABLE "hei_info" DROP CONSTRAINT "private_type_required_if_private_chk";--> statement-breakpoint
ALTER TABLE "president_assignment" DROP CONSTRAINT "president_assignment_hei_id_hei_hei_id_fk";
--> statement-breakpoint
ALTER TABLE "registrar_assignment" DROP CONSTRAINT "registrar_assignment_hei_id_hei_hei_id_fk";
--> statement-breakpoint
ALTER TABLE "law_school" DROP CONSTRAINT "law_school_hei_id_hei_hei_id_fk";
--> statement-breakpoint
ALTER TABLE "hei_info" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "president_assignment" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "registrar_assignment" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "hei_info" ADD CONSTRAINT "hei_info_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "president_assignment" ADD CONSTRAINT "president_assignment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registrar_assignment" ADD CONSTRAINT "registrar_assignment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "law_school" ADD CONSTRAINT "law_school_hei_id_hei_info_hei_id_fk" FOREIGN KEY ("hei_id") REFERENCES "public"."hei_info"("hei_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "president_assignment" DROP COLUMN "hei_id";--> statement-breakpoint
ALTER TABLE "registrar_assignment" DROP COLUMN "hei_id";--> statement-breakpoint
ALTER TABLE "hei_info" ADD CONSTRAINT "address_required_when_not_draft_chk" CHECK ("hei_info"."form_status" = 'Draft' OR (
        "hei_info"."hei_name" IS NOT NULL AND
        "hei_info"."ownership_type" IS NOT NULL AND
        "hei_info"."hei_type" IS NOT NULL AND
        "hei_info"."email" IS NOT NULL AND
        "hei_info"."telephone" IS NOT NULL AND
        "hei_info"."building" IS NOT NULL AND
        "hei_info"."street" IS NOT NULL AND
        "hei_info"."barangay" IS NOT NULL AND
        "hei_info"."city" IS NOT NULL AND
        "hei_info"."province" IS NOT NULL AND
        "hei_info"."region" IS NOT NULL
      ));--> statement-breakpoint
ALTER TABLE "hei_info" ADD CONSTRAINT "private_type_required_if_private_chk" CHECK ("hei_info"."ownership_type" != 'Private' OR "hei_info"."private_type" IS NOT NULL);