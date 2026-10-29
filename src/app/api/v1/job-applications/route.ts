import { asc, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db/client";
import { jobApplications, plans } from "@/db/schema";

const bodySchema = z.object({
  roleTitle: z.string().min(1),
  company: z.string().min(1),
  stage: z.enum(["saved", "applied", "interviewing"]),
  planId: z.uuid().nullable().optional(),
});

export async function GET() {
  const rows = await db.select().from(jobApplications).orderBy(asc(jobApplications.roleTitle));
  return Response.json(rows);
}

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: "Invalid application" }, { status: 400 });
  }

  const planId = parsed.data.planId ?? null;
  if (planId) {
    const [plan] = await db.select({ id: plans.id }).from(plans).where(eq(plans.id, planId));
    if (!plan) {
      return Response.json({ error: "Plan not found" }, { status: 404 });
    }
  }

  const [row] = await db
    .insert(jobApplications)
    .values({
      roleTitle: parsed.data.roleTitle,
      company: parsed.data.company,
      stage: parsed.data.stage,
      planId,
    })
    .returning();
  return Response.json(row, { status: 201 });
}