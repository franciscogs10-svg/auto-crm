"use client";

import Link from "next/link";
import * as Icons from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatRelativeDate } from "@/lib/constants";

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
  nextStep?: { title: string; dueDate: Date | number };
  lastActivity?: Date | number;
  alertCount?: number;
  contactCount?: number;
  dealCount?: number;
  pipelineValue?: number;
}

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const IconComponent =
    (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[
      project.icon
    ] || Icons.Briefcase;

  const typeConfig = TYPE_COLORS[project.type] || TYPE_COLORS.personal;
  const statusConfig = STATUS_COLORS[project.status] || STATUS_COLORS.active;

  return (
    <Link href={`/projects/${project.slug}`} className="block group">
      <Card
        className="h-full transition-shadow hover:shadow-md overflow-hidden"
        style={{ borderLeftWidth: 4, borderLeftColor: project.color }}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <IconComponent className="h-5 w-5 shrink-0" />
            <h3 className="font-semibold text-sm truncate flex-1 group-hover:underline">
              {project.name}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <Badge
              variant="outline"
              style={{
                borderColor: typeConfig.color,
                color: typeConfig.color,
              }}
              className="text-[10px] px-1.5 py-0"
            >
              {typeConfig.label}
            </Badge>
            <Badge
              variant="secondary"
              style={{
                backgroundColor: statusConfig.color + "20",
                color: statusConfig.color,
              }}
              className="text-[10px] px-1.5 py-0"
            >
              {statusConfig.label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pb-2 space-y-1.5 text-xs text-muted-foreground">
          <p className="line-clamp-1">{project.description}</p>

          {project.nextStep && (
            <div className="flex items-center gap-1">
              <Icons.ArrowRight className="h-3 w-3 shrink-0" />
              <span className="truncate">{project.nextStep.title}</span>
              <span className="ml-auto text-[10px] whitespace-nowrap">
                {formatRelativeDate(project.nextStep.dueDate)}
              </span>
            </div>
          )}

          {project.lastActivity && (
            <div className="flex items-center gap-1">
              <Icons.Clock className="h-3 w-3 shrink-0" />
              <span>{formatRelativeDate(project.lastActivity)}</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-2 border-t text-[11px] text-muted-foreground flex items-center gap-3">
          {project.contactCount != null && (
            <span className="flex items-center gap-1">
              <Icons.Users className="h-3 w-3" />
              {project.contactCount}
            </span>
          )}
          {project.dealCount != null && (
            <span className="flex items-center gap-1">
              <Icons.Handshake className="h-3 w-3" />
              {project.dealCount}
            </span>
          )}
          {project.pipelineValue != null && (
            <span className="flex items-center gap-1">
              <Icons.DollarSign className="h-3 w-3" />
              {formatCurrency(project.pipelineValue)}
            </span>
          )}
          {(project.alertCount ?? 0) > 0 && (
            <Badge
              variant="destructive"
              className="ml-auto text-[10px] px-1.5 py-0 h-4"
            >
              {project.alertCount}
            </Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
