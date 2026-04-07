import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { agentLogs } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");
  const agent = searchParams.get("agent");
  const status = searchParams.get("status");

  const conditions = [];
  if (projectId) conditions.push(eq(agentLogs.projectId, projectId));
  if (agent) conditions.push(eq(agentLogs.agent, agent));
  if (status) conditions.push(eq(agentLogs.status, status));

  const results = await db
    .select()
    .from(agentLogs)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(agentLogs.createdAt))
    .limit(50);

  return NextResponse.json(results);
}

export async function POST(request: NextRequest) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalido" }, { status: 400 });
  }

  const { projectId, agent, type, summary, payload } = body;

  if (!agent || !type || !summary) {
    return NextResponse.json(
      { error: "Agent, type y summary son requeridos" },
      { status: 400 }
    );
  }

  try {
    const result = await db
      .insert(agentLogs)
      .values({
        projectId: projectId || null,
        agent,
        type,
        summary,
        payload: payload || null,
        createdAt: new Date(),
      })
      .returning()
      .get();

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown";
    return NextResponse.json(
      { error: `Error al crear log: ${msg}` },
      { status: 500 }
    );
  }
}
