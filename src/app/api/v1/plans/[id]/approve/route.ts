import { eq } from "drizzle-orm";

import { db } from "@/db/client";
import { plans } from "@/db/schema";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const [plan] = await db.select().from(plans).where(eq(plans.id, id));
  if (!plan) {
    return Response.json({ error: "Plan not found" }, { status: 404 });
  }

  const [row] = await db.update(plans).set({ approved: true }).where(eq(plans.id, id)).returning();
  return Response.json(row);
}