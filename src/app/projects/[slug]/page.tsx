import { db } from "@/db";
import {
  projects,
  contacts,
  deals,
  nextSteps,
  activities,
  projectNotes,
  pipelineStages,
} from "@/db/schema";
import { eq, and, isNull, asc, desc, count } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ProjectHeader } from "@/components/projects/ProjectHeader";
import { ProjectTabs } from "@/components/projects/ProjectTabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Briefcase, DollarSign, ListChecks } from "lucide-react";
import { formatCurrency, formatRelativeDate } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const project = await db
    .select()
    .from(projects)
    .where(eq(projects.slug, slug))
    .get();

  if (!project) {
    notFound();
  }

  // Contacts count
  const [contactsResult] = await db
    .select({ value: count() })
    .from(contacts)
    .where(eq(contacts.projectId, project.id));

  // Deals count and pipeline value
  const projectContacts = await db
    .select({ id: contacts.id })
    .from(contacts)
    .where(eq(contacts.projectId, project.id));

  let dealsCount = 0;
  let pipelineValue = 0;

  for (const c of projectContacts) {
    const contactDeals = await db
      .select({ value: deals.value, stageId: deals.stageId })
      .from(deals)
      .where(eq(deals.contactId, c.id));

    for (const d of contactDeals) {
      dealsCount++;
      const [stage] = await db
        .select()
        .from(pipelineStages)
        .where(eq(pipelineStages.id, d.stageId));
      if (stage && !stage.isWon && !stage.isLost) {
        pipelineValue += d.value;
      }
    }
  }

  // Pending next steps count
  const [pendingResult] = await db
    .select({ value: count() })
    .from(nextSteps)
    .where(
      and(eq(nextSteps.projectId, project.id), isNull(nextSteps.completedAt))
    );

  // Notes (last 3)
  const recentNotes = await db
    .select()
    .from(projectNotes)
    .where(eq(projectNotes.projectId, project.id))
    .orderBy(desc(projectNotes.createdAt))
    .limit(3);

  // Upcoming next steps (next 5 incomplete)
  const upcomingSteps = await db
    .select()
    .from(nextSteps)
    .where(
      and(eq(nextSteps.projectId, project.id), isNull(nextSteps.completedAt))
    )
    .orderBy(asc(nextSteps.dueDate))
    .limit(5);

  // Recent activities (last 5)
  const recentActivities = await db
    .select({
      id: activities.id,
      type: activities.type,
      description: activities.description,
      contactName: contacts.name,
      createdAt: activities.createdAt,
    })
    .from(activities)
    .leftJoin(contacts, eq(activities.contactId, contacts.id))
    .where(eq(activities.projectId, project.id))
    .orderBy(desc(activities.createdAt))
    .limit(5);

  const stats = [
    {
      label: "Contactos",
      value: contactsResult?.value ?? 0,
      icon: Users,
    },
    {
      label: "Deals",
      value: dealsCount,
      icon: Briefcase,
    },
    {
      label: "Pipeline",
      value: formatCurrency(pipelineValue),
      icon: DollarSign,
    },
    {
      label: "Pasos Pendientes",
      value: pendingResult?.value ?? 0,
      icon: ListChecks,
    },
  ];

  const priorityColors: Record<string, string> = {
    urgent: "destructive",
    high: "destructive",
    medium: "secondary",
    low: "outline",
  };

  return (
    <div className="space-y-6">
      <ProjectHeader
        project={{
          ...project,
          description: project.description ?? "",
        }}
      />

      <ProjectTabs projectSlug={project.slug} />

      {/* Resumen tab content (default) */}
      <div className="space-y-6">
        {/* Stat cards row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} size="sm">
              <CardContent className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notas Recientes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentNotes.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin notas aun.</p>
              ) : (
                recentNotes.map((note) => (
                  <div key={note.id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">
                        {note.title || "Sin titulo"}
                      </p>
                      <Badge variant="outline" className="text-[10px]">
                        {note.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {note.content}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Upcoming Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Proximos Pasos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingSteps.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Sin pasos pendientes.
                </p>
              ) : (
                upcomingSteps.map((step) => (
                  <div key={step.id} className="flex items-start gap-2">
                    <Badge
                      variant={
                        (priorityColors[step.priority] as
                          | "destructive"
                          | "secondary"
                          | "outline") ?? "secondary"
                      }
                      className="text-[10px] mt-0.5 shrink-0"
                    >
                      {step.priority}
                    </Badge>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {step.title}
                      </p>
                      {step.dueDate && (
                        <p className="text-[11px] text-muted-foreground">
                          {formatRelativeDate(step.dueDate)}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivities.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Sin actividad reciente.
                </p>
              ) : (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="space-y-0.5">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[10px]">
                        {activity.type}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {formatRelativeDate(activity.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm line-clamp-1">
                      {activity.description}
                    </p>
                    {activity.contactName && (
                      <p className="text-[11px] text-muted-foreground">
                        {activity.contactName}
                      </p>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
