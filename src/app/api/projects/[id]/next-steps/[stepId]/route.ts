import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { nextSteps } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; stepId: string }> }
) {
  const { stepId } = await params;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalido" }, { status: 400 });
  }

  const existing = await db
    .select()
    .from(nextSteps)
    .where(eq(nextSteps.id, stepId))
    .get();

  if (!existing) {
    return NextResponse.json(
      { error: "Paso no encontrado" },
      { status: 404 }
    );
  }

  const updateData: Record<string, unknown> = {};
  if (body.title !== undefined) updateData.title = body.title;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.priority !== undefined) updateData.priority = body.priority;
  if (body.dueDate !== undefined) {
    updateData.dueDate = body.dueDate ? new Date(body.dueDate) : null;
  }
  if (body.completedAt !== undefined) {
    updateData.completedAt = body.completedAt ? new Date(body.completedAt) : null;
  }

  const result = await db
    .update(nextSteps)
    .set(updateData)
    .where(eq(nextSteps.id, stepId))
    .returning()
    .get();

  return NextResponse.json(result);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; stepId: string }> }
) {
  const { stepId } = await params;

  const existing = await db
    .select()
    .from(nextSteps)
    .where(eq(nextSteps.id, stepId))
    .get();

  if (!existing) {
    return NextResponse.json(
      { error: "Paso no encontrado" },
      { status: 404 }
    );
  }

  await db.delete(nextSteps).where(eq(nextSteps.id, stepId)).run();
  return NextResponse.json({ success: true });
}
