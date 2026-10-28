import { eq } from "drizzle-orm";

import { db } from "@/db/client";
import { targetRoles } from "@/db/schema";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const [row] = await db.select().from(targetRoles).where(eq(targetRoles.id, id));
  if (!row) {
    return Response.json({ error: "Target role not found" }, { status: 404 });
  }
  return Response.json(row);
}