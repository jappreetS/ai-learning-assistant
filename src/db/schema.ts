import { boolean, date, integer, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";

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