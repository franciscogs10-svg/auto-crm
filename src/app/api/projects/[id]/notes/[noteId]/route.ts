import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projectNotes } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; noteId: string }> }
) {
  const { noteId } = await params;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalido" }, { status: 400 });
  }

  const existing = await db
    .select()
    .from(projectNotes)
    .where(eq(projectNotes.id, noteId))
    .get();

  if (!existing) {
    return NextResponse.json(
      { error: "Nota no encontrada" },
      { status: 404 }
    );
  }

  const updateData: Record<string, unknown> = { updatedAt: new Date() };
  if (body.title !== undefined) updateData.title = body.title;
  if (body.content !== undefined) updateData.content = body.content;
  if (body.category !== undefined) updateData.category = body.category;
  if (body.pinned !== undefined) updateData.pinned = body.pinned;

  const result = await db
    .update(projectNotes)
    .set(updateData)
    .where(eq(projectNotes.id, noteId))
    .returning()
    .get();

  return NextResponse.json(result);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; noteId: string }> }
) {
  const { noteId } = await params;

  const existing = await db
    .select()
    .from(projectNotes)
    .where(eq(projectNotes.id, noteId))
    .get();

  if (!existing) {
    return NextResponse.json(
      { error: "Nota no encontrada" },
      { status: 404 }
    );
  }

  await db.delete(projectNotes).where(eq(projectNotes.id, noteId)).run();
  return NextResponse.json({ success: true });
}
