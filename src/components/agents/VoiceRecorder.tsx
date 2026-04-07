"use client";

import { useState, useRef, useCallback } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
  isProcessing: boolean;
}

export function VoiceRecorder({ onTranscription, isProcessing }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: mimeType });

        if (blob.size < 1000) {
          setError("Audio muy corto. Intenta de nuevo.");
          return;
        }

        // Send to transcribe endpoint
        const formData = new FormData();
        formData.append("audio", blob, "audio.webm");

        try {
          const res = await fetch("/api/voice/transcribe", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();

          if (data.error) {
            setError(data.error);
          } else if (data.text) {
            onTranscription(data.text);
          }
        } catch {
          setError("Error de conexion al transcribir");
        }
      };

      recorder.start(250);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);
    } catch {
      setError("No se pudo acceder al microfono. Verifica los permisos.");
    }
  }, [onTranscription]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isRecording]);

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Recording button */}
      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isProcessing}
        className={`
          w-24 h-24 rounded-full flex items-center justify-center transition-all
          ${isRecording
            ? "bg-red-500 hover:bg-red-600 animate-pulse"
            : isProcessing
              ? "bg-muted cursor-not-allowed"
              : "bg-primary hover:bg-primary/90 cursor-pointer"
          }
        `}
      >
        {isProcessing ? (
          <Loader2 className="h-10 w-10 text-white animate-spin" />
        ) : isRecording ? (
          <Square className="h-8 w-8 text-white" />
        ) : (
          <Mic className="h-10 w-10 text-white" />
        )}
      </button>

      {/* Status text */}
      <div className="text-center">
        {isRecording ? (
          <div className="space-y-1">
            <p className="text-lg font-medium text-red-500">
              Grabando... {formatDuration(duration)}
            </p>
            <p className="text-sm text-muted-foreground">
              Toca para detener
            </p>
          </div>
        ) : isProcessing ? (
          <p className="text-sm text-muted-foreground">Transcribiendo...</p>
        ) : (
          <div className="space-y-1">
            <p className="text-lg font-medium">Toca para hablar</p>
            <p className="text-sm text-muted-foreground">
              Describe lo que quieres registrar en tu CRM
            </p>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="text-sm text-red-500 text-center max-w-xs">
          {error}
          <Button
            variant="ghost"
            size="sm"
            className="ml-2"
            onClick={() => setError(null)}
          >
            Cerrar
          </Button>
        </div>
      )}
    </div>
  );
}
