import { boolean, date, integer, pgEnum, pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";

export const stage = pgEnum("stage", [
  "studied",
  "practiced",
  "applied",
  "demonstrated",
]);

export const plans = pgTable("plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  roleTitle: text("role_title").notNull(),
  company: text("company").notNull(),
  lengthWeeks: integer("length_weeks").notNull(),
  currentWeek: integer("current_week").notNull(),
  active: boolean("active").notNull().default(false),
  approved: boolean("approved").notNull().default(false),
  fromModel: boolean("from_model").notNull().default(false),
});

export const applicationStage = pgEnum("application_stage", [
  "saved",
  "applied",
  "interviewing",
]);

export const jobApplications = pgTable("job_applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  roleTitle: text("role_title").notNull(),
  company: text("company").notNull(),
  stage: applicationStage("stage").notNull(),
  planId: uuid("plan_id").references(() => plans.id, { onDelete: "set null" }),
});

export const planWeeks = pgTable("plan_weeks", {
  id: uuid("id").primaryKey().defaultRandom(),
  planId: uuid("plan_id")
    .notNull()
    .references(() => plans.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  title: text("title").notNull(),
  detail: text("detail").notNull(),
  position: integer("position").notNull(),
});

export const skills = pgTable("skills", {
  id: uuid("id").primaryKey().defaultRandom(),
  planId: uuid("plan_id")
    .notNull()
    .references(() => plans.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  stage: stage("stage"),
  latestNote: text("latest_note").notNull().default(""),
  nextStep: text("next_step").notNull().default(""),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  planId: uuid("plan_id")
    .notNull()
    .references(() => plans.id, { onDelete: "cascade" }),
  skillId: uuid("skill_id")
    .notNull()
    .references(() => skills.id, { onDelete: "cascade" }),
  occurredOn: date("occurred_on").notNull(),
  duration: text("duration").notNull(),
  stage: stage("stage").notNull(),
  note: text("note").notNull(),
});

export const targetRoleSource = pgEnum("target_role_source", [
  "resume-jd",
  "jd-only",
  "written",
]);

export const gapKind = pgEnum("gap_kind", ["match", "gap", "proof"]);

export const targetRoles = pgTable("target_roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  applicationId: uuid("application_id"),
  source: targetRoleSource("source").notNull(),
  roleTitle: text("role_title"),
  company: text("company"),
  resumeExcerpt: text("resume_excerpt"),
  jobDescription: text("job_description"),
  writtenSkills: text("written_skills"),
  level: text("level"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const skillGaps = pgTable("skill_gaps", {
  id: uuid("id").primaryKey().defaultRandom(),
  targetRoleId: uuid("target_role_id")
    .notNull()
    .references(() => targetRoles.id, { onDelete: "cascade" }),
  kind: gapKind("kind").notNull(),
  name: text("name").notNull(),
  detail: text("detail").notNull(),
  position: integer("position").notNull(),
});