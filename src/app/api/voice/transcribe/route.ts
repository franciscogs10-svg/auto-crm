import { NextResponse } from "next/server";

/**
 * POST /api/voice/transcribe
 * Receives audio blob (FormData), sends to Gemini API for transcription, returns text.
 * Uses Gemini's audio understanding capabilities.
 */
export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY no configurada. Agrega la variable de entorno." },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const audio = formData.get("audio") as Blob | null;

    if (!audio) {
      return NextResponse.json({ error: "No se recibio audio" }, { status: 400 });
    }

    // Convert audio blob to base64
    const arrayBuffer = await audio.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString("base64");

    // Determine MIME type
    const mimeType = audio.type || "audio/webm";

    // Use Gemini API for audio transcription
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inlineData: {
                    mimeType,
                    data: base64Audio,
                  },
                },
                {
                  text: "Transcribe este audio en espanol. Devuelve SOLO el texto transcrito, sin comentarios ni explicaciones adicionales.",
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0,
            maxOutputTokens: 1000,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Gemini API error:", error);
      return NextResponse.json(
        { error: "Error al transcribir audio" },
        { status: 502 }
      );
    }

    const result = await response.json();
    const text =
      result.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    if (!text) {
      return NextResponse.json(
        { error: "No se pudo obtener transcripcion" },
        { status: 500 }
      );
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      { error: "Error interno al procesar audio" },
      { status: 500 }
    );
  }
}
