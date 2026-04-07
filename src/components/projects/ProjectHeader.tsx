"use client";

import * as Icons from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const TYPE_COLORS: Record<string, { label: string; color: string }> = {
  personal: { label: "Personal", color: "#10b981" },
  mixed: { label: "Mixto", color: "#3b82f6" },
  kn: { label: "KN", color: "#f59e0b" },
};

const STATUS_COLORS: Record<string, { label: string; color: string }> = {
  active: { label: "Activo", color: "#22c55e" },
  paused: { label: "Pausado", color: "#eab308" },
  pending: { label: "Pendiente", color: "#3b82f6" },
  archived: { label: "Archivado", color: "#6b7280" },
};

interface Project {
  id: string;
  name: string;
  slug: string;
  type: string;
  status: string;
  description: string;
  color: string;
  icon: string;
}

interface ProjectHeaderProps {
  project: Project;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const IconComponent =
    (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[
      project.icon
    ] || Icons.Briefcase;

  const typeConfig = TYPE_COLORS[project.type] || TYPE_COLORS.personal;
  const statusConfig = STATUS_COLORS[project.status] || STATUS_COLORS.active;

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="p-2.5 rounded-lg"
            style={{ backgroundColor: project.color + "20" }}
          >
            <IconComponent className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant="outline"
                style={{
                  borderColor: typeConfig.color,
                  color: typeConfig.color,
                }}
              >
                {typeConfig.label}
              </Badge>
              <Badge
                variant="secondary"
                style={{
                  backgroundColor: statusConfig.color + "20",
                  color: statusConfig.color,
                }}
              >
                {statusConfig.label}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Icons.Pencil className="h-4 w-4 mr-1.5" />
            Editar
          </Button>
          <Button variant="outline" size="sm">
            <Icons.Settings className="h-4 w-4 mr-1.5" />
            Configuracion
          </Button>
        </div>
      </div>

      {project.description && (
        <p className="text-muted-foreground text-sm max-w-2xl">
          {project.description}
        </p>
      )}
    </div>
  );
}
