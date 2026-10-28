import { asc, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db/client";
import { planWeeks, plans } from "@/db/schema";

const bodySchema = z.object({
  label: z.string().min(1),
  title: z.string().min(1),
  detail: z.string().min(1),
  position: z.number().int(),
});

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const [plan] = await db.select({ id: plans.id }).from(plans).where(eq(plans.id, id));
  if (!plan) {
    return Response.json({ error: "Plan not found" }, { status: 404 });
  }

  const rows = await db
    .select()
    .from(planWeeks)
    .where(eq(planWeeks.planId, id))
    .orderBy(asc(planWeeks.position));
  return Response.json(rows);
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const [plan] = await db.select({ id: plans.id }).from(plans).where(eq(plans.id, id));
  if (!plan) {
    return Response.json({ error: "Plan not found" }, { status: 404 });
  }

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: "Invalid week" }, { status: 400 });
  }

  const [row] = await db.insert(planWeeks).values({ ...parsed.data, planId: id }).returning();
  return Response.json(row, { status: 201 });
}