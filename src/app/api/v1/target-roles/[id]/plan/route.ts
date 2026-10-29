import { asc, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { skillGaps, targetRoles } from "@/db/schema";
import { askForPlan } from "@/server/proposed-plan";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const [role] = await db.select().from(targetRoles).where(eq(targetRoles.id, id));
  if (!role) {
    return Response.json({ error: "Target role not found" }, { status: 404 });
  }

  const gaps = await db
    .select()
    .from(skillGaps)
    .where(eq(skillGaps.targetRoleId, id))
    .orderBy(asc(skillGaps.position));
  if (gaps.length === 0) {
    return Response.json({ error: "No skill gaps" }, { status: 400 });
  }

  try {
    const plan = await askForPlan(gaps);
    return Response.json(plan);
  } catch {
    return Response.json({ error: "The model did not return a plan" }, { status: 502 });
  }
}