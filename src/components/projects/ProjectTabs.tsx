"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "resumen", label: "Resumen" },
  { key: "pipeline", label: "Pipeline" },
  { key: "contactos", label: "Contactos" },
  { key: "notas", label: "Notas" },
  { key: "proximos-pasos", label: "Proximos Pasos" },
] as const;

interface ProjectTabsProps {
  projectSlug: string;
}

export function ProjectTabs({ projectSlug }: ProjectTabsProps) {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "resumen";

  return (
    <nav className="border-b">
      <div className="flex items-center gap-1 -mb-px">
        {TABS.map((tab) => (
          <Link
            key={tab.key}
            href={`/projects/${projectSlug}?tab=${tab.key}`}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-colors border-b-2",
              activeTab === tab.key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
