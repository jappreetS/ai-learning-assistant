import { eq } from "drizzle-orm";

import { db } from "@/db/client";
import { plans } from "@/db/schema";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const [plan] = await db.select().from(plans).where(eq(plans.id, id));
  if (!plan) {
    return Response.json({ error: "Plan not found" }, { status: 404 });
  }
  if (!plan.approved) {
    return Response.json({ error: "Plan is not approved" }, { status: 409 });
  }

  const row = await db.transaction(async (tx) => {
    await tx.update(plans).set({ active: false });
    const [updated] = await tx.update(plans).set({ active: true }).where(eq(plans.id, id)).returning();
    return updated;
  });
  return Response.json(row);
}