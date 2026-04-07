"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIES = [
  { value: "idea", label: "Idea" },
  { value: "decision", label: "Decision" },
  { value: "reference", label: "Referencia" },
  { value: "meeting", label: "Reunion" },
] as const;

const noteSchema = z.object({
  title: z.string().min(1, "El titulo es requerido"),
  content: z.string().min(1, "El contenido es requerido"),
  category: z.enum(["idea", "decision", "reference", "meeting"]),
});

type NoteFormData = z.infer<typeof noteSchema>;

interface NoteEditorProps {
  projectId: string;
  initialData?: NoteFormData;
  noteId?: string;
}

export function NoteEditor({ projectId, initialData, noteId }: NoteEditorProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: initialData || {
      title: "",
      content: "",
      category: "idea",
    },
  });

  const category = watch("category");

  async function onSubmit(data: NoteFormData) {
    const url = noteId
      ? `/api/projects/${projectId}/notes/${noteId}`
      : `/api/projects/${projectId}/notes`;

    const res = await fetch(url, {
      method: noteId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="title">Titulo</Label>
        <Input
          id="title"
          placeholder="Titulo de la nota"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="content">Contenido</Label>
        <Textarea
          id="content"
          placeholder="Escribe tu nota..."
          rows={3}
          {...register("content")}
        />
        {errors.content && (
          <p className="text-xs text-destructive">{errors.content.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label>Categoria</Label>
        <Select
          value={category}
          onValueChange={(val) =>
            setValue("category", val as NoteFormData["category"])
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar categoria" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting
          ? "Guardando..."
          : noteId
            ? "Actualizar nota"
            : "Crear nota"}
      </Button>
    </form>
  );
}
