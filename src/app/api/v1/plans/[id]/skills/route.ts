import { asc, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db/client";
import { plans, skills } from "@/db/schema";

const bodySchema = z.object({
  name: z.string().min(1),
});

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const [plan] = await db.select({ id: plans.id }).from(plans).where(eq(plans.id, id));
  if (!plan) {
    return Response.json({ error: "Plan not found" }, { status: 404 });
  }

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: "Invalid skill" }, { status: 400 });
  }

  const [row] = await db.insert(skills).values({ planId: id, name: parsed.data.name }).returning();
  return Response.json(row, { status: 201 });
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const [plan] = await db.select({ id: plans.id }).from(plans).where(eq(plans.id, id));
  if (!plan) {
    return Response.json({ error: "Plan not found" }, { status: 404 });
  }

  const rows = await db.select().from(skills).where(eq(skills.planId, id)).orderBy(asc(skills.name));
  return Response.json(rows);
}