import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db/client";
import { plans, sessions, skills } from "@/db/schema";

const bodySchema = z.object({
  skillId: z.uuid(),
  occurredOn: z.iso.date(),
  duration: z.string().min(1),
  stage: z.enum(["studied", "practiced", "applied", "demonstrated"]),
  note: z.string().min(1),
});

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const [plan] = await db.select({ id: plans.id }).from(plans).where(eq(plans.id, id));
  if (!plan) {
    return Response.json({ error: "Plan not found" }, { status: 404 });
  }

  const rows = await db
    .select()
    .from(sessions)
    .where(eq(sessions.planId, id))
    .orderBy(desc(sessions.occurredOn));
  return Response.json(rows);
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: "Invalid session" }, { status: 400 });
  }

  const [skill] = await db
    .select({ id: skills.id })
    .from(skills)
    .where(and(eq(skills.id, parsed.data.skillId), eq(skills.planId, id)));
  if (!skill) {
    return Response.json({ error: "Skill not found on this plan" }, { status: 404 });
  }

  const [row] = await db.insert(sessions).values({ ...parsed.data, planId: id }).returning();
  return Response.json(row, { status: 201 });
}