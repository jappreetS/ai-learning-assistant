import { asc } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db/client";
import { plans } from "@/db/schema";

const bodySchema = z.object({
  roleTitle: z.string().min(1),
  company: z.string().min(1),
  lengthWeeks: z.number().int().positive(),
  currentWeek: z.number().int().positive(),
});

export async function GET() {
  const rows = await db.select().from(plans).orderBy(asc(plans.roleTitle));
  return Response.json(rows);
}

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: "Invalid plan" }, { status: 400 });
  }

  const [row] = await db
    .insert(plans)
    .values({ ...parsed.data, active: false, approved: false })
    .returning();
  return Response.json(row, { status: 201 });
}