import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const status = searchParams.get("status");

  const conditions = [];
  if (type) conditions.push(eq(projects.type, type));
  if (status) conditions.push(eq(projects.status, status));

  const results = await db
    .select()
    .from(projects)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(projects.updatedAt));

  return NextResponse.json(results);
}

export async function POST(request: NextRequest) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalido" }, { status: 400 });
  }

  const { name, slug, type, status, description, repos, color, icon } = body;

  if (!name || !slug) {
    return NextResponse.json(
      { error: "Nombre y slug son requeridos" },
      { status: 400 }
    );
  }

  try {
    const now = new Date();
    const result = await db
      .insert(projects)
      .values({
        name,
        slug,
        type: type || "personal",
        status: status || "active",
        description: description || null,
        repos: repos || null,
        color: color || "#6366f1",
        icon: icon || "Briefcase",
        createdAt: now,
        updatedAt: now,
      })
      .returning()
      .get();

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown";
    if (msg.includes("UNIQUE")) {
      return NextResponse.json(
        { error: "Ya existe un proyecto con ese slug" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: `Error al crear proyecto: ${msg}` },
      { status: 500 }
    );
  }
}
