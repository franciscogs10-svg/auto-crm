"use client";

import { useState } from "react";
import { Edit2, ArrowRight, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface TranscriptionPreviewProps {
  text: string;
  onParse: (text: string) => void;
  onCancel: () => void;
  isParsing: boolean;
}

export function TranscriptionPreview({
  text,
  onParse,
  onCancel,
  isParsing,
}: TranscriptionPreviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);

  return (
    <Card className="w-full max-w-md">
      <CardContent className="pt-6 space-y-3">
        <p className="text-sm font-medium text-muted-foreground">
          Transcripcion:
        </p>

        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              rows={3}
              autoFocus
            />
            <Button
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              Listo
            </Button>
          </div>
        ) : (
          <p className="text-lg leading-relaxed">&ldquo;{editedText}&rdquo;</p>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            onClick={() => onParse(editedText)}
            disabled={isParsing}
            className="flex-1 cursor-pointer"
          >
            {isParsing ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : (
              <ArrowRight className="h-4 w-4 mr-1" />
            )}
            Procesar
          </Button>
          {!isEditing && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsEditing(true)}
              className="cursor-pointer"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" onClick={onCancel} className="cursor-pointer">
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
