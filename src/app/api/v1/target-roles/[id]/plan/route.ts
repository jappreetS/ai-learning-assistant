import { asc, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { planWeeks, plans, skillGaps, targetRoles } from "@/db/schema";
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
    const proposal = await askForPlan(gaps);
    const saved = await db.transaction(async (tx) => {
      const [plan] = await tx
        .insert(plans)
        .values({
          roleTitle: role.roleTitle?.trim() || "Target role",
          company: role.company?.trim() || "Not specified",
          lengthWeeks: proposal.lengthWeeks,
          currentWeek: 1,
          active: false,
          approved: false,
        })
        .returning();
      const weeks = await tx
        .insert(planWeeks)
        .values(
          proposal.weeks.map((week, index) => ({
            ...week,
            planId: plan.id,
            position: index + 1,
          })),
        )
        .returning();
      return { plan, weeks };
    });
    return Response.json(saved);
  } catch {
    return Response.json({ error: "The model did not return a plan" }, { status: 502 });
  }
}