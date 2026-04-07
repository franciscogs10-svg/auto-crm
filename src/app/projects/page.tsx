import { db } from "@/db";
import {
  projects,
  contacts,
  deals,
  nextSteps,
  agentLogs,
  pipelineStages,
} from "@/db/schema";
import { eq, count, isNull, sum, and } from "drizzle-orm";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import Link from "next/link";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const allProjects = await db
    .select()
    .from(projects)
    .orderBy(projects.updatedAt);

  // Reverse for desc (drizzle-orm/libsql may not support desc on timestamps cleanly)
  allProjects.reverse();

  const enriched = await Promise.all(
    allProjects.map(async (project) => {
      // Count of incomplete next steps
      const [stepsResult] = await db
        .select({ value: count() })
        .from(nextSteps)
        .where(
          and(
            eq(nextSteps.projectId, project.id),
            isNull(nextSteps.completedAt)
          )
        );

      // Count of contacts
      const [contactsResult] = await db
        .select({ value: count() })
        .from(contacts)
        .where(eq(contacts.projectId, project.id));

      // Count deals and pipeline value via contacts with this projectId
      const projectContacts = await db
        .select({ id: contacts.id })
        .from(contacts)
        .where(eq(contacts.projectId, project.id));

      let dealCount = 0;
      let pipelineValue = 0;

      if (projectContacts.length > 0) {
        for (const c of projectContacts) {
          const contactDeals = await db
            .select({ value: deals.value, stageId: deals.stageId })
            .from(deals)
            .where(eq(deals.contactId, c.id));

          for (const d of contactDeals) {
            dealCount++;
            // Check if stage is active (not won/lost)
            const [stage] = await db
              .select()
              .from(pipelineStages)
              .where(eq(pipelineStages.id, d.stageId));
            if (stage && !stage.isWon && !stage.isLost) {
              pipelineValue += d.value;
            }
          }
        }
      }

      // Count of unread agent logs
      const [logsResult] = await db
        .select({ value: count() })
        .from(agentLogs)
        .where(
          and(
            eq(agentLogs.projectId, project.id),
            eq(agentLogs.status, "unread")
          )
        );

      return {
        id: project.id,
        name: project.name,
        slug: project.slug,
        type: project.type,
        status: project.status,
        description: project.description ?? "",
        color: project.color,
        icon: project.icon,
        contactCount: contactsResult?.value ?? 0,
        dealCount,
        pipelineValue,
        alertCount: logsResult?.value ?? 0,
      };
    })
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Proyectos</h1>
          <p className="text-muted-foreground">
            Gestiona todos tus proyectos IS
          </p>
        </div>
        <Link
          href="#"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nuevo Proyecto
        </Link>
      </div>

      <ProjectGrid projects={enriched} />
    </div>
  );
}
