"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/constants";

const PRIORITY_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  urgent: { label: "Urgente", color: "#ef4444", bg: "#ef444420" },
  high: { label: "Alta", color: "#f97316", bg: "#f9731620" },
  medium: { label: "Media", color: "#3b82f6", bg: "#3b82f620" },
  low: { label: "Baja", color: "#6b7280", bg: "#6b728020" },
};

interface Step {
  id: string;
  title: string;
  priority: string;
  dueDate?: Date | number | null;
  completed: boolean;
}

interface StepItemProps {
  step: Step;
  projectId: string;
}

export function StepItem({ step, projectId }: StepItemProps) {
  const router = useRouter();
  const priorityConfig = PRIORITY_CONFIG[step.priority] || PRIORITY_CONFIG.medium;

  const isOverdue =
    !step.completed &&
    step.dueDate &&
    new Date(step.dueDate).getTime() < Date.now();

  async function toggleComplete() {
    await fetch(`/api/projects/${projectId}/steps/${step.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !step.completed }),
    });
    router.refresh();
  }

  async function deleteStep() {
    await fetch(`/api/projects/${projectId}/steps/${step.id}`, {
      method: "DELETE",
    });
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3 py-2 px-3 rounded-lg border group hover:bg-muted/50 transition-colors">
      <input
        type="checkbox"
        checked={step.completed}
        onChange={toggleComplete}
        className="h-4 w-4 rounded border-muted-foreground/50 cursor-pointer accent-primary"
      />

      <span
        className={`flex-1 text-sm ${
          step.completed
            ? "line-through text-muted-foreground"
            : "text-foreground"
        }`}
      >
        {step.title}
      </span>

      <Badge
        variant="secondary"
        style={{
          backgroundColor: priorityConfig.bg,
          color: priorityConfig.color,
        }}
        className="text-[10px] px-1.5 py-0"
      >
        {priorityConfig.label}
      </Badge>

      {step.dueDate && (
        <span
          className={`text-xs whitespace-nowrap ${
            isOverdue ? "text-destructive font-medium" : "text-muted-foreground"
          }`}
        >
          {formatDate(step.dueDate)}
        </span>
      )}

      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={deleteStep}
        title="Eliminar"
      >
        <X className="h-3.5 w-3.5 text-muted-foreground" />
      </Button>
    </div>
  );
}
