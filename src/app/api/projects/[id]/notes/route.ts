import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projectNotes } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  const conditions = [eq(projectNotes.projectId, id)];
  if (category) conditions.push(eq(projectNotes.category, category));

  const results = await db
    .select()
    .from(projectNotes)
    .where(and(...conditions))
    .orderBy(desc(projectNotes.pinned), desc(projectNotes.createdAt));

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

  const { title, content, category } = body;

  if (!content) {
    return NextResponse.json(
      { error: "Contenido es requerido" },
      { status: 400 }
    );
  }

  try {
    const now = new Date();
    const result = await db
      .insert(projectNotes)
      .values({
        projectId: id,
        title: title || "",
        content,
        category: category || "idea",
        createdAt: now,
        updatedAt: now,
      })
      .returning()
      .get();

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown";
    return NextResponse.json(
      { error: `Error al crear nota: ${msg}` },
      { status: 500 }
    );
  }
}
