import Link from "next/link";
import { db } from "@/db";
import {
  contacts,
  deals,
  activities,
  pipelineStages,
  projects,
  nextSteps,
} from "@/db/schema";
import { eq, asc, desc, and, isNull } from "drizzle-orm";
import { KPICards } from "@/components/dashboard/KPICards";
import { PipelineChart } from "@/components/dashboard/PipelineChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { NotificationBanner } from "@/components/dashboard/NotificationBanner";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import type { DashboardStats } from "@/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // Active projects with nearest next step
  const activeProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.status, "active"));

  const enrichedProjects = await Promise.all(
    activeProjects.map(async (project) => {
      const [nearestStep] = await db
        .select()
        .from(nextSteps)
        .where(
          and(
            eq(nextSteps.projectId, project.id),
            isNull(nextSteps.completedAt)
          )
        )
        .orderBy(asc(nextSteps.dueDate))
        .limit(1);

      return {
        id: project.id,
        name: project.name,
        slug: project.slug,
        type: project.type,
        status: project.status,
        description: project.description ?? "",
        color: project.color,
        icon: project.icon,
        nextStep: nearestStep
          ? { title: nearestStep.title, dueDate: nearestStep.dueDate ?? new Date() }
          : undefined,
      };
    })
  );

  const allContacts = await db.select().from(contacts);
  const allDeals = await db.select().from(deals);
  const stages = await db
    .select()
    .from(pipelineStages)
    .orderBy(asc(pipelineStages.order));

  const activeDeals = allDeals.filter((d) => {
    const stage = stages.find((s) => s.id === d.stageId);
    return stage && !stage.isWon && !stage.isLost;
  });

  const wonDeals = allDeals.filter((d) => {
    const stage = stages.find((s) => s.id === d.stageId);
    return stage?.isWon;
  });

  const stats: DashboardStats = {
    totalContacts: allContacts.length,
    activeDeals: activeDeals.length,
    totalPipelineValue: activeDeals.reduce((sum, d) => sum + d.value, 0),
    wonDealsValue: wonDeals.reduce((sum, d) => sum + d.value, 0),
    conversionRate:
      allDeals.length > 0
        ? Math.round((wonDeals.length / allDeals.length) * 100)
        : 0,
    hotLeads: allContacts.filter((c) => c.temperature === "hot").length,
  };

  const pipelineData = stages
    .filter((s) => !s.isLost)
    .map((stage) => ({
      name: stage.name,
      count: allDeals.filter((d) => d.stageId === stage.id).length,
      value: allDeals
        .filter((d) => d.stageId === stage.id)
        .reduce((sum, d) => sum + d.value, 0),
      color: stage.color,
    }));

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
    .orderBy(desc(activities.createdAt))
    .limit(5);

  const isFirstRun = allContacts.length === 0 && allDeals.length === 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Resumen de tu pipeline de ventas
        </p>
      </div>

      {enrichedProjects.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Proyectos Activos</h2>
            <Link
              href="/projects"
              className="text-sm text-primary hover:underline"
            >
              Ver todos
            </Link>
          </div>
          <ProjectGrid projects={enrichedProjects} />
        </div>
      )}

      {isFirstRun && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-6">
          <h2 className="text-lg font-semibold mb-2">
            Bienvenido a Auto-CRM
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Tu CRM esta listo. Aqui tienes como comenzar:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div className="p-3 rounded-lg bg-card border">
              <p className="font-medium">1. Personaliza tu CRM</p>
              <p className="text-xs text-muted-foreground mt-1">
                Ejecuta <code className="bg-muted px-1 rounded">/setup</code> en Claude Code
              </p>
            </div>
            <div className="p-3 rounded-lg bg-card border">
              <p className="font-medium">2. Agrega contactos</p>
              <p className="text-xs text-muted-foreground mt-1">
                Ve a Contactos o usa <code className="bg-muted px-1 rounded">/add-lead</code>
              </p>
            </div>
            <div className="p-3 rounded-lg bg-card border">
              <p className="font-medium">3. Carga datos demo</p>
              <p className="text-xs text-muted-foreground mt-1">
                Ejecuta <code className="bg-muted px-1 rounded">npm run seed</code> en terminal
              </p>
            </div>
          </div>
        </div>
      )}

      <NotificationBanner />

      <KPICards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PipelineChart data={pipelineData} />
        </div>
        <div>
          <RecentActivity
            activities={
              recentActivities as Array<{
                id: string;
                type: string;
                description: string;
                contactName: string | null;
                createdAt: number | Date;
              }>
            }
          />
        </div>
      </div>
    </div>
  );
}
