import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db/client";
import { skills } from "@/db/schema";

const bodySchema = z
  .object({
    stage: z.enum(["studied", "practiced", "applied", "demonstrated"]).nullable().optional(),
    latestNote: z.string().optional(),
    nextStep: z.string().optional(),
  })
  .refine((value) => Object.keys(value).length > 0);

export async function PATCH(request: Request, context: { params: Promise<{ id: string; skillId: string }> }) {
  const { id, skillId } = await context.params;
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: "Invalid progress" }, { status: 400 });
  }

  const [row] = await db
    .update(skills)
    .set(parsed.data)
    .where(and(eq(skills.id, skillId), eq(skills.planId, id)))
    .returning();
  if (!row) {
    return Response.json({ error: "Skill not found on this plan" }, { status: 404 });
  }
  return Response.json(row);
}