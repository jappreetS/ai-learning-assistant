import { z } from "zod";

const text = z.string().trim().min(1);

export const targetRoleSchema = z.discriminatedUnion("source", [
  z.object({
    source: z.literal("resume-jd"),
    applicationId: z.uuid().nullable().optional(),
    roleTitle: text,
    company: text,
    resumeExcerpt: text,
    jobDescription: text,
  }),
  z.object({
    source: z.literal("jd-only"),
    applicationId: z.uuid().nullable().optional(),
    jobDescription: text,
  }),
  z.object({
    source: z.literal("written"),
    applicationId: z.uuid().nullable().optional(),
    roleTitle: text,
    writtenSkills: text,
    level: text,
  }),
]);

export const sessionSchema = z.object({
  skillId: z.uuid(),
  occurredOn: z.iso.date(),
  duration: text,
  stage: z.enum(["studied", "practiced", "applied", "demonstrated"]),
  note: text,
});