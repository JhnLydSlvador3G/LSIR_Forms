CREATE TYPE "public"."year_level" AS ENUM('First Year basic law course', 'Second Year basic law course', 'Third Year basic law course', 'Fourth Year basic law course', 'Fifth Year basic law course', 'Refresher students', 'Masteral degree level', 'Doctoral degree level');--> statement-breakpoint
CREATE TYPE "public"."accreditation_classification" AS ENUM('Level I', 'Level II', 'Level III', 'Center of Development', 'Center of Excellence', 'Deregulated Status', 'Autonomous Status');--> statement-breakpoint
DO $$ BEGIN
	CREATE TYPE "public"."basic_law_course_enum" AS ENUM('Ladderized Master in Legal Studies - Juris Doctor ', 'Juris Doctor');
EXCEPTION
	WHEN duplicate_object THEN NULL;
END $$;--> statement-breakpoint
CREATE TYPE "public"."curricular_schedule" AS ENUM('Semestral', 'Trimesteral', 'Summer');--> statement-breakpoint
CREATE TYPE "public"."days" AS ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');--> statement-breakpoint
CREATE TYPE "public"."doctorate_program_classification" AS ENUM('Doctor of Civil Law', 'Doctor of Juridical Science', 'Others');--> statement-breakpoint
CREATE TYPE "public"."employment_status" AS ENUM('Regular', 'Part-time');--> statement-breakpoint
CREATE TYPE "public"."fee_category" AS ENUM('Other school fees', 'Miscellaneous fees', 'New Fee');--> statement-breakpoint
CREATE TYPE "public"."form_status" AS ENUM('Draft', 'Submitted', 'Approved');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('Male', 'Female', 'Other');--> statement-breakpoint
CREATE TYPE "public"."graduate_law_course_enum" AS ENUM('Master of Laws', 'DCL/SJD');--> statement-breakpoint
CREATE TYPE "public"."graduate_studies_duration_enum" AS ENUM('with Thesis/Dissertation', 'Non-thesis', 'Online/Hybrid');--> statement-breakpoint
CREATE TYPE "public"."hei_type" AS ENUM('University', 'College', 'Others');--> statement-breakpoint
CREATE TYPE "public"."highest_academic_degree" AS ENUM('Basic Law Course', 'Units in Masteral level degree in law', 'Units in Doctoral level degree in law', 'Doctoral degree in law');--> statement-breakpoint
CREATE TYPE "public"."juris_doctor_duration_enum" AS ENUM('4 years', '5 years', 'Both');--> statement-breakpoint
CREATE TYPE "public"."law_program_classification" AS ENUM('Juris Doctor', 'Master of Laws', 'Doctorate');--> statement-breakpoint
CREATE TYPE "public"."month" AS ENUM('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');--> statement-breakpoint
CREATE TYPE "public"."ownership" AS ENUM('Private', 'Public');--> statement-breakpoint
CREATE TYPE "public"."private_type" AS ENUM('Sectarian', 'Non-Sectarian');--> statement-breakpoint
CREATE TYPE "public"."program_type" AS ENUM('Bachelor of Laws', 'Juris Doctor', 'Master of Laws', 'DCL/SJD', 'Refresher Course');--> statement-breakpoint
CREATE TYPE "public"."law_school_program_classification" AS ENUM('Government Permit I', 'Government Permit II', 'Government Permit III', 'Government Recognition', 'Others');--> statement-breakpoint
CREATE TYPE "public"."region" AS ENUM('Ilocos Region (Region I)', 'Cagayan Valley (Region II)', 'Central Luzon (Region III)', 'CALABARZON (Region IV-A)', 'MIMAROPA (Region IV-B)', 'Bicol Region (Region V)', 'Western Visayas (Region VI)', 'Central Visayas (Region VII)', 'Eastern Visayas (Region VIII)', 'Zamboanga Peninsula (Region IX)', 'Northern Mindanao (Region X)', 'Davao Region (Region XI)', 'SOCCSKSARGEN (Region XII)', 'Caraga (Region XIII)', 'Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)', 'Cordillera Administrative Region (CAR)', 'National Capital Region (NCR)');--> statement-breakpoint
CREATE TYPE "public"."semester" AS ENUM('First Semester', 'Second Semester', 'Third Semester');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"username" text,
	"display_username" text,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "faculty" (
	"faculty_id" serial PRIMARY KEY NOT NULL,
	"law_school_id" integer NOT NULL,
	"title" varchar,
	"first_name" varchar,
	"middle_name" varchar,
	"last_name" varchar,
	"gender" "gender",
	"employment_status" "employment_status",
	"years_teaching" integer,
	"years_professional_experience" integer,
	"roll_number" integer,
	"form_status" "form_status" DEFAULT 'Draft',
	CONSTRAINT "faculty_info_required_when_not_draft_chk" CHECK ("faculty"."form_status" = 'Draft' OR ("faculty"."first_name" IS NOT NULL AND
                "faculty"."last_name" IS NOT NULL AND
                "faculty"."gender" IS NOT NULL AND
                "faculty"."employment_status" IS NOT NULL AND
                "faculty"."years_teaching" IS NOT NULL AND
                "faculty"."years_professional_experience" IS NOT NULL AND
                "faculty"."roll_number" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "faculty_experience" (
	"faculty_experience_id" serial PRIMARY KEY NOT NULL,
	"faculty_id" integer NOT NULL,
	"experience" varchar,
	"form_status" "form_status" DEFAULT 'Draft',
	CONSTRAINT "faculty_experience_required_when_not_draft_chk" CHECK ("faculty_experience"."form_status" = 'Draft' OR ("faculty_experience"."experience" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "faculty_teaching_load" (
	"faculty_teaching_load_id" serial PRIMARY KEY NOT NULL,
	"faculty_id" integer NOT NULL,
	"assigned_subject" varchar,
	"number_units" integer,
	"form_status" "form_status" DEFAULT 'Draft',
	CONSTRAINT "faculty_teaching_load_required_when_not_draft_chk" CHECK ("faculty_teaching_load"."form_status" = 'Draft' OR (
                "faculty_teaching_load"."assigned_subject" IS NOT NULL AND 
                "faculty_teaching_load"."number_units" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "hei" (
	"hei_id" serial PRIMARY KEY NOT NULL,
	"hei_name" varchar,
	"ownership_type" "ownership",
	"hei_type" "hei_type",
	"private_type" "private_type",
	"email" varchar,
	"telephone" varchar,
	"building" varchar,
	"street" varchar,
	"barangay" varchar,
	"district" varchar,
	"city" varchar,
	"province" varchar,
	"region" "region",
	"website" varchar,
	"form_status" "form_status" DEFAULT 'Draft',
	CONSTRAINT "address_required_when_not_draft_chk" CHECK ("hei"."form_status" = 'Draft' OR (
        "hei"."hei_name" IS NOT NULL AND
        "hei"."ownership_type" IS NOT NULL AND
        "hei"."hei_type" IS NOT NULL AND
        "hei"."email" IS NOT NULL AND
        "hei"."telephone" IS NOT NULL AND
        "hei"."building" IS NOT NULL AND
        "hei"."street" IS NOT NULL AND
        "hei"."barangay" IS NOT NULL AND
        "hei"."city" IS NOT NULL AND
        "hei"."province" IS NOT NULL AND
        "hei"."region" IS NOT NULL
      )),
	CONSTRAINT "private_type_required_if_private_chk" CHECK ("hei"."ownership_type" != 'Private' OR "hei"."private_type" IS NOT NULL)
);
--> statement-breakpoint
CREATE TABLE "president" (
	"president_id" serial PRIMARY KEY NOT NULL,
	"hei_id" integer,
	"title" varchar,
	"first_name" varchar,
	"middle_name" varchar,
	"last_name" varchar,
	"telephone_number" varchar,
	"form_status" "form_status" DEFAULT 'Draft',
	CONSTRAINT "hei_id_required_when_not_draft_chk" CHECK ("president"."form_status" = 'Draft' OR ("president"."hei_id" IS NOT NULL AND
        "president"."first_name" IS NOT NULL AND
        "president"."last_name" IS NOT NULL AND
        "president"."telephone_number" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "registrar" (
	"registrar_id" serial PRIMARY KEY NOT NULL,
	"title" varchar,
	"first_name" varchar,
	"middle_name" varchar,
	"last_name" varchar,
	"telephone_number" varchar,
	"form_status" "form_status" DEFAULT 'Draft',
	CONSTRAINT "registrar_info_required_when_not_draft_chk" CHECK ("registrar"."form_status" = 'Draft' OR ("registrar"."first_name" IS NOT NULL AND
                "registrar"."last_name" IS NOT NULL AND
                "registrar"."telephone_number" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "registrar_assignment" (
	"assignment_id" serial PRIMARY KEY NOT NULL,
	"registrar_id" integer NOT NULL,
	"hei_id" integer NOT NULL,
	"start_date" date,
	"end_date" date,
	"form_status" "form_status" DEFAULT 'Draft',
	CONSTRAINT "registrar_assignment_info_required_when_not_draft_chk" CHECK ("registrar_assignment"."form_status" = 'Draft' OR ("registrar_assignment"."start_date" IS NOT NULL AND
                "registrar_assignment"."end_date" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "dean" (
	"dean_id" serial PRIMARY KEY NOT NULL,
	"title" varchar,
	"first_name" varchar,
	"middle_name" varchar,
	"last_name" varchar,
	"mobile_number" varchar,
	"date_appointed" varchar,
	"email_address" varchar,
	"highest_legal_educational_attainment" "highest_academic_degree",
	"roll_number" varchar,
	"year_teaching_experience" integer,
	"year_admin_experience" integer,
	"form_status" "form_status" DEFAULT 'Draft',
	CONSTRAINT "dean_info_required_when_not_draft_chk" CHECK ("dean"."form_status" = 'Draft' OR ("dean"."first_name" IS NOT NULL AND
                "dean"."last_name" IS NOT NULL AND
                "dean"."mobile_number" IS NOT NULL AND
                "dean"."date_appointed" IS NOT NULL AND
                "dean"."email_address" IS NOT NULL AND
                "dean"."highest_legal_educational_attainment" IS NOT NULL AND
                "dean"."year_admin_experience" IS NOT NULL AND
                "dean"."roll_number" IS NOT NULL AND
                "dean"."year_teaching_experience" IS NOT NULL                              
                ))
);
--> statement-breakpoint
CREATE TABLE "dean_assignment" (
	"assignment_id" serial PRIMARY KEY NOT NULL,
	"dean_id" integer,
	"law_school_id" integer,
	"start_date" date,
	"end_date" date,
	"form_status" "form_status" DEFAULT 'Draft',
	CONSTRAINT "dean_assignment_info_required_when_not_draft_chk" CHECK ("dean_assignment"."form_status" = 'Draft' OR ("dean_assignment"."dean_id" IS NOT NULL AND
                "dean_assignment"."law_school_id" IS NOT NULL AND
                "dean_assignment"."start_date" IS NOT NULL AND
                "dean_assignment"."end_date" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "law_school" (
	"law_school_id" serial PRIMARY KEY NOT NULL,
	"hei_id" integer,
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
	"program_classification" "law_program_classification"[],
	"doctorate_classification" "doctorate_program_classification",
	"recognition_status" "law_school_program_classification",
	"accredication_status" "accreditation_classification",
	"form_status" "form_status" DEFAULT 'Draft',
	CONSTRAINT "hei_id_required_when_not_draft_chk" CHECK ("law_school"."form_status" = 'Draft' OR ("law_school"."hei_id" IS NOT NULL AND
                "law_school"."email" IS NOT NULL AND
                "law_school"."telephone" IS NOT NULL AND
                "law_school"."recognition_status" IS NOT NULL AND
                "law_school"."accreditation_status" IS NOT NULL AND
                "law_school"."building" IS NOT NULL AND
                "law_school"."street" IS NOT NULL AND
                "law_school"."barangay" IS NOT NULL AND
                "law_school"."district" IS NOT NULL AND
                "law_school"."city" IS NOT NULL AND
                "law_school"."region" IS NOT NULL AND
                "law_school"."province" IS NOT NULL AND
                "law_school"."program_classification" IS NOT NULL
                )),
	CONSTRAINT "doctorate_classification_required_when_doctorate_program_chk" CHECK (array_position("law_school"."program_classification", 'Doctorate'::law_program_classification) IS NULL OR "law_school"."doctorate_classification" IS NOT NULL)
);
--> statement-breakpoint
CREATE TABLE "academic_load" (
	"academic_load_id" serial PRIMARY KEY NOT NULL,
	"curriculum_id" integer NOT NULL,
	"year_level" "year_level",
	"total_units" integer,
	"semester" "semester",
	"is_draft" boolean DEFAULT true NOT NULL,
	CONSTRAINT "academic_load_info_required_when_not_draft_chk" CHECK ("academic_load"."is_draft" = true OR ("academic_load"."year_level" IS NOT NULL AND
                "academic_load"."total_units" IS NOT NULL AND
                "academic_load"."semester" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "curriculum" (
	"curriculum_id" serial PRIMARY KEY NOT NULL,
	"submission_id" integer NOT NULL,
	"leb_approval_date" date,
	"form_status" "form_status" DEFAULT 'Draft',
	CONSTRAINT "curriculum_info_required_when_not_draft_chk" CHECK ("curriculum"."form_status" = 'Draft' OR ("curriculum"."leb_approval_date" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "graduate_studies_duration" (
	"graduate_studies_duration_id" serial PRIMARY KEY NOT NULL,
	"program_information_id" integer NOT NULL,
	"duration" "graduate_studies_duration_enum",
	"form_status" "form_status" DEFAULT 'Draft'
);
--> statement-breakpoint
CREATE TABLE "juris_doctor_duration" (
	"juris_doctor_duration_id" serial PRIMARY KEY NOT NULL,
	"program_information_id" integer NOT NULL,
	"duration" "juris_doctor_duration_enum",
	"form_status" "form_status" DEFAULT 'Draft'
);
--> statement-breakpoint
CREATE TABLE "basic_law_course" (
	"basic_law_course_id" serial PRIMARY KEY NOT NULL,
	"program_information_id" integer NOT NULL,
	"program_type" "program_type"[],
	"available_academic_track" varchar,
	"form_status" "form_status" DEFAULT 'Draft',
	CONSTRAINT "basic_law_course_required_when_not_draft_chk" CHECK ("basic_law_course"."form_status" = 'Draft' OR (
            "basic_law_course"."program_type" IS NOT NULL AND
            "basic_law_course"."available_academic_track" IS NOT NULL
        ))
);
--> statement-breakpoint
CREATE TABLE "branch_operated" (
	"branch_operated_id" serial PRIMARY KEY NOT NULL,
	"program_information_id" integer NOT NULL,
	"offered" boolean DEFAULT false,
	"recognition_status" "law_school_program_classification",
	"recognition_number" varchar,
	"location" varchar,
	"form_status" "form_status" DEFAULT 'Draft'
);
--> statement-breakpoint
CREATE TABLE "extension_class" (
	"extension_class_id" serial PRIMARY KEY NOT NULL,
	"program_information_id" integer NOT NULL,
	"offered" boolean DEFAULT false,
	"government_authority" varchar,
	"validity_period" varchar,
	"location" varchar,
	"form_status" "form_status" DEFAULT 'Draft'
);
--> statement-breakpoint
CREATE TABLE "graduate_law_course" (
	"graduate_law_course_id" serial PRIMARY KEY NOT NULL,
	"program_information_id" integer NOT NULL,
	"program_type" "graduate_law_course_enum"[],
	"permit_number" varchar,
	"year_issued" integer,
	"form_status" "form_status" DEFAULT 'Draft'
);
--> statement-breakpoint
CREATE TABLE "refresher_course" (
	"refresher_course_id" serial PRIMARY KEY NOT NULL,
	"program_information_id" integer NOT NULL,
	"offered" boolean DEFAULT false,
	"permit_number" varchar,
	"year_issued" integer,
	"terminal_period" varchar,
	"form_status" "form_status" DEFAULT 'Draft'
);
--> statement-breakpoint
CREATE TABLE "academic_calendar" (
	"academic_calendare_id" serial PRIMARY KEY NOT NULL,
	"program_information_id" integer NOT NULL,
	"starting_month" "month",
	"ending_month" "month",
	"form_status" "form_status" DEFAULT 'Draft',
	CONSTRAINT "academic_calendar_required_when_not_draft_chk" CHECK ("academic_calendar"."form_status" = 'Draft' OR ("academic_calendar"."starting_month" IS NOT NULL AND
                "academic_calendar"."ending_month" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "program_information" (
	"program_information_id" serial PRIMARY KEY NOT NULL,
	"law_school_id" integer NOT NULL,
	"submission_id" integer NOT NULL,
	"curricular_schedule" "curricular_schedule",
	"operating_schedule" "days"[],
	"form_status" "form_status" DEFAULT 'Draft',
	CONSTRAINT "program_information_required_when_not_draft_chk" CHECK ("program_information"."form_status" = 'Draft' OR 
                ("program_information"."curricular_schedule" IS NOT NULL
                AND "program_information"."operating_schedule" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "certification" (
	"certification_id" serial PRIMARY KEY NOT NULL,
	"submission_id" integer NOT NULL,
	"certification_year" integer,
	"certification_month" "month",
	"form_status" "form_status" DEFAULT 'Draft',
	CONSTRAINT "certification_info_required_when_not_draft_chk" CHECK ("certification"."form_status" = 'Draft' OR ("certification"."certification_year" IS NOT NULL AND
                "certification"."certification_month" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "dean_attestation" (
	"attestation_id" serial PRIMARY KEY NOT NULL,
	"certification_id" integer NOT NULL,
	"printed_name" varchar,
	"id_type" varchar,
	"id_number" varchar,
	"form_status" "form_status" DEFAULT 'Draft',
	CONSTRAINT "dean_attestation_info_required_when_not_draft_chk" CHECK ("dean_attestation"."form_status" = 'Draft' OR ("dean_attestation"."printed_name" IS NOT NULL AND
                "dean_attestation"."id_type" IS NOT NULL AND
                "dean_attestation"."id_number" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "president_attestation" (
	"attestation_id" serial PRIMARY KEY NOT NULL,
	"certification_id" integer NOT NULL,
	"printed_name" varchar,
	"id_type" varchar,
	"id_number" varchar,
	"form_status" "form_status" DEFAULT 'Draft',
	CONSTRAINT "president_attestation_info_required_when_not_draft_chk" CHECK ("president_attestation"."form_status" = 'Draft' OR ("president_attestation"."printed_name" IS NOT NULL AND
                "president_attestation"."id_type" IS NOT NULL AND
                "president_attestation"."id_number" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "faculty_development" (
	"faculty_development_id" serial PRIMARY KEY NOT NULL,
	"submission_id" integer NOT NULL,
	"training_title" varchar,
	"training_hours" integer,
	"number_of_participants" integer,
	"competencies_covered" varchar,
	"date_conducted" date,
	"form_status" "form_status" DEFAULT 'Draft',
	CONSTRAINT "faculty_development_info_required_when_not_draft_chk" CHECK ("faculty_development"."form_status" = 'Draft' OR ("faculty_development"."training_title" IS NOT NULL AND
                "faculty_development"."training_hours" IS NOT NULL AND
                "faculty_development"."number_of_participants" IS NOT NULL AND
                "faculty_development"."competencies_covered" IS NOT NULL AND
                "faculty_development"."date_conducted" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "faculty_statistics" (
	"faculty_statistics_id" serial PRIMARY KEY NOT NULL,
	"submission_id" integer NOT NULL,
	"gender" "gender",
	"basic" integer,
	"master" integer,
	"doctor" integer,
	"regular" integer,
	"part_time" integer,
	"retired" integer,
	"private" integer,
	"judges" integer,
	"prosecutor" integer,
	"other_government" integer,
	"form_status" "form_status" DEFAULT 'Draft',
	CONSTRAINT "faculty_statistics_info_required_when_not_draft_chk" CHECK ("faculty_statistics"."form_status" = 'Draft' OR ("faculty_statistics"."gender" IS NOT NULL AND
                "faculty_statistics"."basic" IS NOT NULL AND
                "faculty_statistics"."master" IS NOT NULL AND
                "faculty_statistics"."doctor" IS NOT NULL AND
                "faculty_statistics"."regular" IS NOT NULL AND
                "faculty_statistics"."part_time" IS NOT NULL AND
                "faculty_statistics"."retired" IS NOT NULL AND
                "faculty_statistics"."private" IS NOT NULL AND
                "faculty_statistics"."judges" IS NOT NULL AND
                "faculty_statistics"."prosecutor" IS NOT NULL AND
                "faculty_statistics"."other_government" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "fees" (
	"fees_id" serial PRIMARY KEY NOT NULL,
	"financial_report_id" integer NOT NULL,
	"fee_description" varchar,
	"fee_amount" numeric(10, 2),
	"category" "fee_category",
	"is_draft" boolean DEFAULT true,
	CONSTRAINT "fees_info_required_when_not_draft_chk" CHECK ("fees"."is_draft" = true OR ("fees"."fee_description" IS NOT NULL AND
                "fees"."fee_amount" IS NOT NULL AND
                "fees"."category" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "financial_report" (
	"financial_report_id" serial PRIMARY KEY NOT NULL,
	"submission_id" integer NOT NULL,
	"last_fee_increase_sy" numeric(10, 2),
	"course" "program_type",
	"form_status" "form_status" DEFAULT 'Draft',
	CONSTRAINT "financial_report_info_required_when_not_draft_chk" CHECK ("financial_report"."form_status" = 'Draft' OR ("financial_report"."last_fee_increase_sy" IS NOT NULL AND
                "financial_report"."course" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "year_level_report" (
	"year_level_report_id" serial PRIMARY KEY NOT NULL,
	"financial_report_id" integer NOT NULL,
	"year_level" "year_level",
	"tuition_per_unit" numeric(10, 2),
	"is_draft" boolean DEFAULT true,
	CONSTRAINT "year_level_report_info_required_when_not_draft_chk" CHECK ("year_level_report"."is_draft" = true OR ("year_level_report"."year_level" IS NOT NULL AND
                "year_level_report"."tuition_per_unit" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "block_section" (
	"block_section_id" serial PRIMARY KEY NOT NULL,
	"submission_id" integer,
	"year_level" integer,
	"section" varchar
);
--> statement-breakpoint
CREATE TABLE "class_schedule" (
	"class_schedule_id" serial PRIMARY KEY NOT NULL,
	"block_section_id" integer,
	"faculty_name" varchar,
	"faculty_id" integer,
	"subject_title" varchar,
	"day" "days",
	"time_start" time,
	"time_end" time,
	"form_status" "form_status" DEFAULT 'Draft',
	CONSTRAINT "class_schedule_required_when_not_draft_chk" CHECK ("class_schedule"."form_status" = 'Draft' OR (
                "class_schedule"."faculty_name" IS NOT NULL AND
                "class_schedule"."faculty_id" IS NOT NULL AND
                "class_schedule"."subject_title" IS NOT NULL AND
                "class_schedule"."day" IS NOT NULL AND
                "class_schedule"."time_start" IS NOT NULL AND
                "class_schedule"."time_end" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "enrollment_statistics" (
	"enrollment_statistics_id" serial PRIMARY KEY NOT NULL,
	"submission_id" integer,
	"program_type" "program_type",
	"year_level" "year_level",
	"male_count" integer,
	"female_count" integer,
	"full_time_count" integer,
	"working_count" integer,
	"scholars_count" integer,
	"transfer_count" integer,
	"form_status" "form_status" DEFAULT 'Draft',
	CONSTRAINT "enrollment_statistics_required_when_not_draft_chk" CHECK ("enrollment_statistics"."form_status" = 'Draft' OR (
            "enrollment_statistics"."program_type" IS NOT NULL AND
            "enrollment_statistics"."year_level" IS NOT NULL AND
            "enrollment_statistics"."male_count" IS NOT NULL AND
            "enrollment_statistics"."female_count" IS NOT NULL AND
            "enrollment_statistics"."full_time_count" IS NOT NULL AND
            "enrollment_statistics"."scholars_count" IS NOT NULL AND
            "enrollment_statistics"."working_count" IS NOT NULL AND
            "enrollment_statistics"."transfer_count" IS NOT NULL
        ))
);
--> statement-breakpoint
CREATE TABLE "submission" (
	"submission_id" serial PRIMARY KEY NOT NULL,
	"law_school_id" integer NOT NULL,
	"school_year" varchar,
	"semester" "semester",
	"submitted_at" date,
	"status" varchar,
	"is_draft" boolean DEFAULT true,
	CONSTRAINT "submission_info_required_when_not_draft_chk" CHECK ("submission"."is_draft" = true OR ("submission"."school_year" IS NOT NULL AND
                "submission"."semester" IS NOT NULL AND
                "submission"."submitted_at" IS NOT NULL AND
                "submission"."status" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "faculty_training" (
	"training_id" serial PRIMARY KEY NOT NULL,
	"submission_id" integer NOT NULL,
	"training_year" integer,
	"training_month" "month",
	"is_draft" boolean DEFAULT true NOT NULL,
	CONSTRAINT "faculty_training_info_required_when_not_draft_chk" CHECK ("faculty_training"."is_draft" = true OR ("faculty_training"."training_year" IS NOT NULL AND
                "faculty_training"."training_month" IS NOT NULL))
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faculty" ADD CONSTRAINT "faculty_law_school_id_law_school_law_school_id_fk" FOREIGN KEY ("law_school_id") REFERENCES "public"."law_school"("law_school_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faculty_experience" ADD CONSTRAINT "faculty_experience_faculty_id_faculty_faculty_id_fk" FOREIGN KEY ("faculty_id") REFERENCES "public"."faculty"("faculty_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faculty_teaching_load" ADD CONSTRAINT "faculty_teaching_load_faculty_id_faculty_faculty_id_fk" FOREIGN KEY ("faculty_id") REFERENCES "public"."faculty"("faculty_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "president" ADD CONSTRAINT "president_hei_id_hei_hei_id_fk" FOREIGN KEY ("hei_id") REFERENCES "public"."hei"("hei_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registrar_assignment" ADD CONSTRAINT "registrar_assignment_registrar_id_registrar_registrar_id_fk" FOREIGN KEY ("registrar_id") REFERENCES "public"."registrar"("registrar_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registrar_assignment" ADD CONSTRAINT "registrar_assignment_hei_id_hei_hei_id_fk" FOREIGN KEY ("hei_id") REFERENCES "public"."hei"("hei_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dean_assignment" ADD CONSTRAINT "dean_assignment_dean_id_dean_dean_id_fk" FOREIGN KEY ("dean_id") REFERENCES "public"."dean"("dean_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dean_assignment" ADD CONSTRAINT "dean_assignment_law_school_id_law_school_law_school_id_fk" FOREIGN KEY ("law_school_id") REFERENCES "public"."law_school"("law_school_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "law_school" ADD CONSTRAINT "law_school_hei_id_hei_hei_id_fk" FOREIGN KEY ("hei_id") REFERENCES "public"."hei"("hei_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academic_load" ADD CONSTRAINT "academic_load_curriculum_id_curriculum_curriculum_id_fk" FOREIGN KEY ("curriculum_id") REFERENCES "public"."curriculum"("curriculum_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "curriculum" ADD CONSTRAINT "curriculum_submission_id_submission_submission_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submission"("submission_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "graduate_studies_duration" ADD CONSTRAINT "graduate_studies_duration_program_information_id_program_information_program_information_id_fk" FOREIGN KEY ("program_information_id") REFERENCES "public"."program_information"("program_information_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "juris_doctor_duration" ADD CONSTRAINT "juris_doctor_duration_program_information_id_program_information_program_information_id_fk" FOREIGN KEY ("program_information_id") REFERENCES "public"."program_information"("program_information_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "basic_law_course" ADD CONSTRAINT "basic_law_course_program_information_id_program_information_program_information_id_fk" FOREIGN KEY ("program_information_id") REFERENCES "public"."program_information"("program_information_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "branch_operated" ADD CONSTRAINT "branch_operated_program_information_id_program_information_program_information_id_fk" FOREIGN KEY ("program_information_id") REFERENCES "public"."program_information"("program_information_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "extension_class" ADD CONSTRAINT "extension_class_program_information_id_program_information_program_information_id_fk" FOREIGN KEY ("program_information_id") REFERENCES "public"."program_information"("program_information_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "graduate_law_course" ADD CONSTRAINT "graduate_law_course_program_information_id_program_information_program_information_id_fk" FOREIGN KEY ("program_information_id") REFERENCES "public"."program_information"("program_information_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresher_course" ADD CONSTRAINT "refresher_course_program_information_id_program_information_program_information_id_fk" FOREIGN KEY ("program_information_id") REFERENCES "public"."program_information"("program_information_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academic_calendar" ADD CONSTRAINT "academic_calendar_program_information_id_program_information_program_information_id_fk" FOREIGN KEY ("program_information_id") REFERENCES "public"."program_information"("program_information_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_information" ADD CONSTRAINT "program_information_law_school_id_law_school_law_school_id_fk" FOREIGN KEY ("law_school_id") REFERENCES "public"."law_school"("law_school_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_information" ADD CONSTRAINT "program_information_submission_id_submission_submission_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submission"("submission_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certification" ADD CONSTRAINT "certification_submission_id_submission_submission_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submission"("submission_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dean_attestation" ADD CONSTRAINT "dean_attestation_certification_id_certification_certification_id_fk" FOREIGN KEY ("certification_id") REFERENCES "public"."certification"("certification_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "president_attestation" ADD CONSTRAINT "president_attestation_certification_id_certification_certification_id_fk" FOREIGN KEY ("certification_id") REFERENCES "public"."certification"("certification_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faculty_development" ADD CONSTRAINT "faculty_development_submission_id_submission_submission_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submission"("submission_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faculty_statistics" ADD CONSTRAINT "faculty_statistics_submission_id_submission_submission_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submission"("submission_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fees" ADD CONSTRAINT "fees_financial_report_id_financial_report_financial_report_id_fk" FOREIGN KEY ("financial_report_id") REFERENCES "public"."financial_report"("financial_report_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "financial_report" ADD CONSTRAINT "financial_report_submission_id_submission_submission_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submission"("submission_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "year_level_report" ADD CONSTRAINT "year_level_report_financial_report_id_financial_report_financial_report_id_fk" FOREIGN KEY ("financial_report_id") REFERENCES "public"."financial_report"("financial_report_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "block_section" ADD CONSTRAINT "block_section_submission_id_submission_submission_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submission"("submission_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_schedule" ADD CONSTRAINT "class_schedule_block_section_id_block_section_block_section_id_fk" FOREIGN KEY ("block_section_id") REFERENCES "public"."block_section"("block_section_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_schedule" ADD CONSTRAINT "class_schedule_faculty_id_faculty_faculty_id_fk" FOREIGN KEY ("faculty_id") REFERENCES "public"."faculty"("faculty_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollment_statistics" ADD CONSTRAINT "enrollment_statistics_submission_id_submission_submission_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submission"("submission_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission" ADD CONSTRAINT "submission_law_school_id_law_school_law_school_id_fk" FOREIGN KEY ("law_school_id") REFERENCES "public"."law_school"("law_school_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faculty_training" ADD CONSTRAINT "faculty_training_submission_id_submission_submission_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submission"("submission_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "curriculum_submission_id_idx" ON "curriculum" USING btree ("submission_id");--> statement-breakpoint
CREATE INDEX "program_information_submission_id_idx" ON "program_information" USING btree ("submission_id");--> statement-breakpoint
CREATE INDEX "certification_submission_id_idx" ON "certification" USING btree ("submission_id");--> statement-breakpoint
CREATE INDEX "faculty_development_submission_id_idx" ON "faculty_development" USING btree ("submission_id");--> statement-breakpoint
CREATE INDEX "faculty_statistics_submission_id_idx" ON "faculty_statistics" USING btree ("submission_id");--> statement-breakpoint
CREATE INDEX "financial_report_submission_id_idx" ON "financial_report" USING btree ("submission_id");--> statement-breakpoint
CREATE INDEX "block_section_submission_id_idx" ON "block_section" USING btree ("submission_id");--> statement-breakpoint
CREATE INDEX "enrollment_statistics_submission_id_idx" ON "enrollment_statistics" USING btree ("submission_id");--> statement-breakpoint
CREATE INDEX "faculty_training_submission_id_idx" ON "faculty_training" USING btree ("submission_id");