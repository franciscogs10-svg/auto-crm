"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StepItem } from "./StepItem";

const PRIORITY_ORDER: Record<string, number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
};

interface Step {
  id: string;
  title: string;
  priority: string;
  dueDate?: Date | number | null;
  completed: boolean;
}

interface StepsListProps {
  steps: Step[];
  projectId: string;
}

export function StepsList({ steps, projectId }: StepsListProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [isAdding, setIsAdding] = useState(false);

  const sorted = [...steps].sort((a, b) => {
    // Incomplete first
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    // Then by priority
    const pa = PRIORITY_ORDER[a.priority] ?? 2;
    const pb = PRIORITY_ORDER[b.priority] ?? 2;
    if (pa !== pb) return pa - pb;
    // Then by due date (earliest first)
    const da = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
    const db = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
    return da - db;
  });

  async function addStep(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    setIsAdding(true);
    try {
      await fetch(`/api/projects/${projectId}/steps`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), priority }),
      });
      setTitle("");
      setPriority("medium");
      router.refresh();
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={addStep} className="flex items-center gap-2">
        <Input
          placeholder="Nuevo paso..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1"
        />
        <Select value={priority} onValueChange={(val) => setPriority(val ?? "medium")}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="urgent">Urgente</SelectItem>
            <SelectItem value="high">Alta</SelectItem>
            <SelectItem value="medium">Media</SelectItem>
            <SelectItem value="low">Baja</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" size="sm" disabled={isAdding || !title.trim()}>
          <Plus className="h-4 w-4 mr-1" />
          Agregar
        </Button>
      </form>

      {sorted.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No hay pasos pendientes. Agrega uno para comenzar.
        </p>
      ) : (
        <div className="space-y-1">
          {sorted.map((step) => (
            <StepItem key={step.id} step={step} projectId={projectId} />
          ))}
        </div>
      )}
    </div>
  );
}
