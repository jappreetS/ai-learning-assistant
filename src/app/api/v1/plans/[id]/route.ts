import { eq } from "drizzle-orm";

import { db } from "@/db/client";
import { plans } from "@/db/schema";

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const [plan] = await db.delete(plans).where(eq(plans.id, id)).returning();
  if (!plan) {
    return Response.json({ error: "Plan not found" }, { status: 404 });
  }
  return Response.json(plan);
}
