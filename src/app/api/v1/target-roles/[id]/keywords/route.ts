import { eq } from "drizzle-orm";

import { db } from "@/db/client";
import { targetRoles } from "@/db/schema";
import { keywordsIn } from "@/server/keywords";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const [role] = await db
    .select({
      source: targetRoles.source,
      resumeExcerpt: targetRoles.resumeExcerpt,
      jobDescription: targetRoles.jobDescription,
    })
    .from(targetRoles)
    .where(eq(targetRoles.id, id));
  if (!role) {
    return Response.json({ error: "Target role not found" }, { status: 404 });
  }
  if (role.source !== "resume-jd" || !role.resumeExcerpt || !role.jobDescription) {
    return Response.json({ keywords: [] });
  }
  return Response.json({ keywords: keywordsIn(role.jobDescription, role.resumeExcerpt) });
}