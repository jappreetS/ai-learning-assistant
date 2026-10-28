import { asc, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db/client";
import { skillGaps, targetRoles } from "@/db/schema";

const bodySchema = z.object({
  kind: z.enum(["match", "gap", "proof"]),
  name: z.string().min(1),
  detail: z.string().min(1),
  position: z.number().int(),
});

async function findRole(id: string) {
  const [role] = await db.select({ id: targetRoles.id }).from(targetRoles).where(eq(targetRoles.id, id));
  return role;
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!(await findRole(id))) {
    return Response.json({ error: "Target role not found" }, { status: 404 });
  }

  const rows = await db
    .select()
    .from(skillGaps)
    .where(eq(skillGaps.targetRoleId, id))
    .orderBy(asc(skillGaps.position));
  return Response.json(rows);
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!(await findRole(id))) {
    return Response.json({ error: "Target role not found" }, { status: 404 });
  }

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: "Invalid gap" }, { status: 400 });
  }

  const [row] = await db
    .insert(skillGaps)
    .values({ ...parsed.data, targetRoleId: id })
    .returning();
  return Response.json(row, { status: 201 });
}