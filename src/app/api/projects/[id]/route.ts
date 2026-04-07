import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const project = await db
    .select()
    .from(projects)
    .where(eq(projects.id, id))
    .get();

  if (!project) {
    return NextResponse.json(
      { error: "Proyecto no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(project);
}

export async function PUT(
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

  const existing = await db
    .select()
    .from(projects)
    .where(eq(projects.id, id))
    .get();

  if (!existing) {
    return NextResponse.json(
      { error: "Proyecto no encontrado" },
      { status: 404 }
    );
  }

  const updateData: Record<string, unknown> = { updatedAt: new Date() };
  if (body.name !== undefined) updateData.name = body.name;
  if (body.slug !== undefined) updateData.slug = body.slug;
  if (body.type !== undefined) updateData.type = body.type;
  if (body.status !== undefined) updateData.status = body.status;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.repos !== undefined) updateData.repos = body.repos;
  if (body.kpis !== undefined) updateData.kpis = body.kpis;
  if (body.color !== undefined) updateData.color = body.color;
  if (body.icon !== undefined) updateData.icon = body.icon;

  const result = await db
    .update(projects)
    .set(updateData)
    .where(eq(projects.id, id))
    .returning()
    .get();

  return NextResponse.json(result);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const existing = await db
    .select()
    .from(projects)
    .where(eq(projects.id, id))
    .get();

  if (!existing) {
    return NextResponse.json(
      { error: "Proyecto no encontrado" },
      { status: 404 }
    );
  }

  await db.delete(projects).where(eq(projects.id, id)).run();
  return NextResponse.json({ success: true });
}
