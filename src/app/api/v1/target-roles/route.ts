import { desc } from "drizzle-orm";

import { db } from "@/db/client";
import { targetRoles } from "@/db/schema";

import { targetRoleSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  const parsed = targetRoleSchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: "Invalid target role" }, { status: 400 });
  }

  const [row] = await db.insert(targetRoles).values(parsed.data).returning();
  return Response.json(row, { status: 201 });
}

export async function GET() {
  const [row] = await db.select().from(targetRoles).orderBy(desc(targetRoles.createdAt)).limit(1);
  return Response.json(row ?? null);
}