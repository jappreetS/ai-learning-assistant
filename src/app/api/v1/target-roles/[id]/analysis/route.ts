import { eq } from "drizzle-orm";

import { db } from "@/db/client";
import { targetRoles } from "@/db/schema";
import { askForSkillGaps } from "@/server/skill-gaps";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const [role] = await db.select().from(targetRoles).where(eq(targetRoles.id, id));
  if (!role) {
    return Response.json({ error: "Target role not found" }, { status: 404 });
  }

  try {
    const gaps = await askForSkillGaps(role);
    return Response.json({ gaps });
  } catch {
    return Response.json({ error: "The model did not return skill gaps" }, { status: 502 });
  }
}