import { ProjectCard } from "./ProjectCard";

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

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg font-medium">No hay proyectos</p>
        <p className="text-sm mt-1">Crea tu primer proyecto para comenzar.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
