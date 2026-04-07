import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { nextSteps } from "@/db/schema";
import { eq, asc, desc, isNull, sql } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const results = await db
    .select()
    .from(nextSteps)
    .where(eq(nextSteps.projectId, id))
    .orderBy(
      desc(isNull(nextSteps.completedAt)),
      sql`CASE ${nextSteps.priority}
        WHEN 'urgent' THEN 0
        WHEN 'high' THEN 1
        WHEN 'medium' THEN 2
        WHEN 'low' THEN 3
        ELSE 4
      END`,
      asc(nextSteps.dueDate)
    );

  return NextResponse.json(results);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalido" }, { status: 400 });
  }

  const { title, description, priority, dueDate } = body;

  if (!title) {
    return NextResponse.json(
      { error: "Titulo es requerido" },
      { status: 400 }
    );
  }

  try {
    const result = await db
      .insert(nextSteps)
      .values({
        projectId: id,
        title,
        description: description || null,
        priority: priority || "medium",
        dueDate: dueDate ? new Date(dueDate) : null,
        createdAt: new Date(),
      })
      .returning()
      .get();

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown";
    return NextResponse.json(
      { error: `Error al crear paso: ${msg}` },
      { status: 500 }
    );
  }
}
