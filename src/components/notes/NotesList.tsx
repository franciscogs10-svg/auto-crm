"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pin } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRelativeDate } from "@/lib/constants";

const CATEGORY_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  idea: { label: "Idea", color: "#a855f7", bg: "#a855f720" },
  decision: { label: "Decision", color: "#22c55e", bg: "#22c55e20" },
  reference: { label: "Referencia", color: "#3b82f6", bg: "#3b82f620" },
  meeting: { label: "Reunion", color: "#f97316", bg: "#f9731620" },
};

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  pinned: boolean;
  createdAt: Date | number;
}

interface NotesListProps {
  notes: Note[];
  projectId: string;
}

export function NotesList({ notes, projectId }: NotesListProps) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = activeCategory
    ? notes.filter((n) => n.category === activeCategory)
    : notes;

  const sorted = [...filtered].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return (
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  });

  async function togglePin(noteId: string, pinned: boolean) {
    await fetch(`/api/projects/${projectId}/notes/${noteId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pinned: !pinned }),
    });
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant={activeCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveCategory(null)}
        >
          Todas
        </Button>
        {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
          <Button
            key={key}
            variant={activeCategory === key ? "default" : "outline"}
            size="sm"
            onClick={() =>
              setActiveCategory(activeCategory === key ? null : key)
            }
            style={
              activeCategory === key
                ? { backgroundColor: config.color, borderColor: config.color }
                : {}
            }
          >
            {config.label}
          </Button>
        ))}
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No hay notas en esta categoria.
        </p>
      ) : (
        <div className="space-y-3">
          {sorted.map((note) => {
            const catConfig =
              CATEGORY_CONFIG[note.category] || CATEGORY_CONFIG.idea;

            return (
              <Card key={note.id} className="relative">
                <CardHeader className="pb-2 flex flex-row items-start justify-between gap-2">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        style={{
                          backgroundColor: catConfig.bg,
                          color: catConfig.color,
                        }}
                        className="text-[10px] shrink-0"
                      >
                        {catConfig.label}
                      </Badge>
                      <h4 className="font-medium text-sm truncate">
                        {note.title}
                      </h4>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatRelativeDate(note.createdAt)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 shrink-0"
                    onClick={() => togglePin(note.id, note.pinned)}
                    title={note.pinned ? "Desfijar" : "Fijar"}
                  >
                    <Pin
                      className="h-3.5 w-3.5"
                      style={note.pinned ? { color: "#3b82f6" } : {}}
                      fill={note.pinned ? "#3b82f6" : "none"}
                    />
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {note.content}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
