"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Edit2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { VoiceParseResult } from "@/types";

const ACTION_LABELS: Record<string, string> = {
  note: "Nota",
  next_step: "Proximo Paso",
  activity: "Actividad",
  contact: "Contacto",
  deal: "Deal",
};

const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
  urgent: { label: "Urgente", color: "bg-red-100 text-red-700" },
  high: { label: "Alta", color: "bg-orange-100 text-orange-700" },
  medium: { label: "Media", color: "bg-blue-100 text-blue-700" },
  low: { label: "Baja", color: "bg-gray-100 text-gray-700" },
};

interface ParsedActionCardProps {
  result: VoiceParseResult;
  onConfirm: () => void;
  onCancel: () => void;
  onEdit: (updated: VoiceParseResult) => void;
}

export function ParsedActionCard({
  result,
  onConfirm,
  onCancel,
  onEdit,
}: ParsedActionCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editTitle, setEditTitle] = useState(result.content.title);
  const [editDescription, setEditDescription] = useState(
    result.content.description || ""
  );
  const router = useRouter();

  const priorityConfig =
    PRIORITY_CONFIG[result.content.priority || "medium"] || PRIORITY_CONFIG.medium;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      // First, find the project ID by slug
      const projectRes = await fetch(`/api/projects?status=active`);
      const projectsList = await projectRes.json();
      const project = projectsList.find(
        (p: { slug: string }) => p.slug === result.project
      );

      if (!project) {
        alert("Proyecto no encontrado");
        setIsSubmitting(false);
        return;
      }

      let endpoint = "";
      let body: Record<string, unknown> = {};

      switch (result.actionType) {
        case "note":
          endpoint = `/api/projects/${project.id}/notes`;
          body = {
            title: editTitle,
            content: editDescription || editTitle,
            category: "idea",
          };
          break;
        case "next_step":
          endpoint = `/api/projects/${project.id}/next-steps`;
          body = {
            title: editTitle,
            description: editDescription,
            priority: result.content.priority || "medium",
            dueDate: result.content.dueDate || null,
          };
          break;
        case "activity":
          // For activities we need a contact — create as a project note for now
          endpoint = `/api/projects/${project.id}/notes`;
          body = {
            title: editTitle,
            content: editDescription || editTitle,
            category: "meeting",
          };
          break;
        default:
          endpoint = `/api/projects/${project.id}/notes`;
          body = {
            title: editTitle,
            content: editDescription || editTitle,
            category: "idea",
          };
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        onConfirm();
        router.push(`/projects/${result.project}`);
      } else {
        alert("Error al guardar");
      }
    } catch {
      alert("Error de conexion");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEdit = () => {
    onEdit({
      ...result,
      content: {
        ...result.content,
        title: editTitle,
        description: editDescription,
      },
    });
    setIsEditing(false);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Accion detectada</CardTitle>
          <div className="flex gap-1.5">
            <Badge variant="outline">
              {ACTION_LABELS[result.actionType] || result.actionType}
            </Badge>
            <Badge className={priorityConfig.color} variant="outline">
              {priorityConfig.label}
            </Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Proyecto: <span className="font-medium">{result.project}</span>
          {result.confidence < 0.7 && (
            <span className="text-amber-500 ml-2">
              (confianza baja: {Math.round(result.confidence * 100)}%)
            </span>
          )}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {isEditing ? (
          <div className="space-y-2">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Titulo"
            />
            <Textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Descripcion (opcional)"
              rows={3}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSaveEdit}>
                Guardar cambios
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <p className="font-medium">{editTitle}</p>
            {editDescription && (
              <p className="text-sm text-muted-foreground mt-1">
                {editDescription}
              </p>
            )}
            {result.content.dueDate && (
              <p className="text-xs text-muted-foreground mt-1">
                Fecha: {result.content.dueDate}
              </p>
            )}
          </div>
        )}

        {/* Action buttons */}
        {!isEditing && (
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="flex-1 cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Check className="h-4 w-4 mr-1" />
              )}
              Confirmar
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsEditing(true)}
              className="cursor-pointer"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
              className="cursor-pointer"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
