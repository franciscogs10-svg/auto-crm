import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * POST /api/voice/parse
 * Receives transcribed text, uses Claude to extract structured action.
 */
export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY no configurada" },
      { status: 500 }
    );
  }

  try {
    const { text, projectSlug } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "No se recibio texto" }, { status: 400 });
    }

    // Get all active projects for context
    const activeProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.status, "active"));

    const projectList = activeProjects
      .map(
        (p) =>
          `- slug: "${p.slug}" | nombre: "${p.name}" | tipo: ${p.type} | descripcion: ${p.description || "sin descripcion"}`
      )
      .join("\n");

    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: "claude-sonnet-4-6-20250514",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: `Eres un asistente que parsea instrucciones habladas para un CRM de proyectos.

Proyectos disponibles:
${projectList}

${projectSlug ? `El usuario esta en el proyecto "${projectSlug}", asi que por defecto las acciones van a ese proyecto a menos que mencione otro.` : ""}

Texto del usuario (transcrito por voz):
"${text}"

Analiza el texto y extrae la accion. Responde SOLO con JSON valido:
{
  "project": "<slug del proyecto detectado>",
  "actionType": "note" | "next_step" | "activity" | "contact" | "deal",
  "content": {
    "title": "<titulo corto de la accion>",
    "description": "<descripcion completa si aplica>",
    "priority": "low" | "medium" | "high" | "urgent",
    "dueDate": "<fecha ISO si se menciona, null si no>"
  },
  "confidence": <0.0 a 1.0>
}

Reglas:
- Si menciona "idea", "anotar", "nota" → actionType: "note"
- Si menciona "hacer", "pendiente", "siguiente paso", "recordarme" → actionType: "next_step"
- Si menciona "llame", "reuni", "email", "seguimiento" → actionType: "activity"
- Si menciona "prospecto", "cliente nuevo", "contacto" → actionType: "contact"
- Si menciona "deal", "oportunidad", "venta", "cotizacion" → actionType: "deal"
- Detecta urgencia: "urgente", "ya", "hoy" → priority: "urgent"
- Detecta fechas relativas: "manana", "lunes", "esta semana" → calcula dueDate
- Si no puedes determinar el proyecto con certeza, usa confidence < 0.5`,
        },
      ],
    });

    const responseText =
      response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return NextResponse.json(parsed);
    }

    return NextResponse.json(
      { error: "No se pudo parsear la respuesta de Claude" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Parse error:", error);
    return NextResponse.json(
      { error: "Error interno al parsear texto" },
      { status: 500 }
    );
  }
}
