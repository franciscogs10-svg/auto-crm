"use client";

import { useState, useCallback } from "react";
import { Bot, Mic, History, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { VoiceRecorder } from "@/components/agents/VoiceRecorder";
import { TranscriptionPreview } from "@/components/agents/TranscriptionPreview";
import { ParsedActionCard } from "@/components/agents/ParsedActionCard";
import type { VoiceParseResult } from "@/types";

type FlowState = "idle" | "transcribing" | "transcribed" | "parsing" | "parsed" | "confirmed";

export default function OrganizadorPage() {
  const [state, setState] = useState<FlowState>("idle");
  const [transcription, setTranscription] = useState("");
  const [parseResult, setParseResult] = useState<VoiceParseResult | null>(null);
  const [history, setHistory] = useState<Array<{ text: string; action: string; project: string; time: Date }>>([]);

  const handleTranscription = useCallback((text: string) => {
    setTranscription(text);
    setState("transcribed");
  }, []);

  const handleParse = useCallback(async (text: string) => {
    setState("parsing");
    try {
      const res = await fetch("/api/voice/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();

      if (data.error) {
        alert(data.error);
        setState("transcribed");
        return;
      }

      setParseResult(data as VoiceParseResult);
      setState("parsed");
    } catch {
      alert("Error al procesar");
      setState("transcribed");
    }
  }, []);

  const handleConfirm = useCallback(() => {
    if (parseResult) {
      setHistory((prev) => [
        {
          text: transcription,
          action: parseResult.actionType,
          project: parseResult.project,
          time: new Date(),
        },
        ...prev,
      ]);
    }
    setState("confirmed");
    setTimeout(() => {
      setState("idle");
      setTranscription("");
      setParseResult(null);
    }, 2000);
  }, [parseResult, transcription]);

  const handleCancel = useCallback(() => {
    setState("idle");
    setTranscription("");
    setParseResult(null);
  }, []);

  const handleEditParsed = useCallback((updated: VoiceParseResult) => {
    setParseResult(updated);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Agente Organizador
            </h1>
            <p className="text-muted-foreground">
              Actualiza tus proyectos por voz — habla y el agente entiende
            </p>
          </div>
        </div>
      </div>

      {/* Main flow area */}
      <div className="flex flex-col items-center py-8">
        {/* Step indicators */}
        <div className="flex items-center gap-2 mb-8 text-sm text-muted-foreground">
          <span className={state === "idle" || state === "transcribing" ? "text-primary font-medium" : ""}>
            <Mic className="h-4 w-4 inline mr-1" />
            Grabar
          </span>
          <span className="text-muted-foreground/40">→</span>
          <span className={state === "transcribed" || state === "parsing" ? "text-primary font-medium" : ""}>
            Revisar
          </span>
          <span className="text-muted-foreground/40">→</span>
          <span className={state === "parsed" ? "text-primary font-medium" : ""}>
            Confirmar
          </span>
        </div>

        {/* Confirmed state */}
        {state === "confirmed" && (
          <div className="flex flex-col items-center gap-3 animate-in fade-in">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <p className="text-lg font-medium text-green-600">
              Registrado exitosamente
            </p>
          </div>
        )}

        {/* Idle / Recording state */}
        {(state === "idle" || state === "transcribing") && (
          <VoiceRecorder
            onTranscription={handleTranscription}
            isProcessing={state === "transcribing"}
          />
        )}

        {/* Transcribed state */}
        {(state === "transcribed" || state === "parsing") && (
          <TranscriptionPreview
            text={transcription}
            onParse={handleParse}
            onCancel={handleCancel}
            isParsing={state === "parsing"}
          />
        )}

        {/* Parsed state */}
        {state === "parsed" && parseResult && (
          <ParsedActionCard
            result={parseResult}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            onEdit={handleEditParsed}
          />
        )}
      </div>

      {/* History */}
      {history.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-3">
            <History className="h-4 w-4" />
            Historial de esta sesion
          </h2>
          <div className="space-y-2">
            {history.map((item, i) => (
              <Card key={i}>
                <CardContent className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm">{item.text}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.project} · {item.action} ·{" "}
                      {item.time.toLocaleTimeString("es-MX", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <Card>
        <CardContent className="py-4">
          <h3 className="text-sm font-medium mb-2">Ejemplos de lo que puedes decir:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>&ldquo;Anota en el casino que Lucas confirmo el presupuesto de diseno&rdquo;</li>
            <li>&ldquo;Proximo paso urgente en training factory: preparar demo para el viernes&rdquo;</li>
            <li>&ldquo;Idea para Coach OS: agregar modulo de nutricion&rdquo;</li>
            <li>&ldquo;Me reuni con el equipo de KN, avanzamos en la integracion&rdquo;</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
