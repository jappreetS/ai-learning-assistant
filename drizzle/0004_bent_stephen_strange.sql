CREATE TYPE "public"."application_stage" AS ENUM('saved', 'applied', 'interviewing');--> statement-breakpoint
CREATE TABLE "job_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role_title" text NOT NULL,
	"company" text NOT NULL,
	"stage" "application_stage" NOT NULL,
	"plan_id" uuid
);
--> statement-breakpoint
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE set null ON UPDATE no action;