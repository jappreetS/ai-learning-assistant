CREATE TYPE "public"."gap_kind" AS ENUM('match', 'gap', 'proof');--> statement-breakpoint
CREATE TYPE "public"."target_role_source" AS ENUM('resume-jd', 'jd-only', 'written');--> statement-breakpoint
CREATE TABLE "skill_gaps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"target_role_id" uuid NOT NULL,
	"kind" "gap_kind" NOT NULL,
	"name" text NOT NULL,
	"detail" text NOT NULL,
	"position" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "target_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid,
	"source" "target_role_source" NOT NULL,
	"role_title" text,
	"company" text,
	"resume_excerpt" text,
	"job_description" text,
	"written_skills" text,
	"level" text
);
--> statement-breakpoint
ALTER TABLE "skill_gaps" ADD CONSTRAINT "skill_gaps_target_role_id_target_roles_id_fk" FOREIGN KEY ("target_role_id") REFERENCES "public"."target_roles"("id") ON DELETE cascade ON UPDATE no action;