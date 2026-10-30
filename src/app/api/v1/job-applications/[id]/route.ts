import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db/client";
import { jobApplications, plans } from "@/db/schema";

const bodySchema = z.object({
  planId: z.uuid(),
});

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: "Invalid job" }, { status: 400 });
  }

  const [plan] = await db.select({ id: plans.id }).from(plans).where(eq(plans.id, parsed.data.planId));
  if (!plan) {
    return Response.json({ error: "Plan not found" }, { status: 404 });
  }

  const [row] = await db
    .update(jobApplications)
    .set({ planId: parsed.data.planId })
    .where(eq(jobApplications.id, id))
    .returning();
  if (!row) {
    return Response.json({ error: "Job not found" }, { status: 404 });
  }
  return Response.json(row);
}