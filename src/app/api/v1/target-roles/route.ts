import { z } from "zod";

import { db } from "@/db/client";
import { targetRoles } from "@/db/schema";

const bodySchema = z.object({
  source: z.enum(["resume-jd", "jd-only", "written"]),
  applicationId: z.uuid().nullable().optional(),
  roleTitle: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  resumeExcerpt: z.string().nullable().optional(),
  jobDescription: z.string().nullable().optional(),
  writtenSkills: z.string().nullable().optional(),
  level: z.string().nullable().optional(),
});

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: "Invalid target role" }, { status: 400 });
  }

  const [row] = await db.insert(targetRoles).values(parsed.data).returning();
  return Response.json(row, { status: 201 });
}