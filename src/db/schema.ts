import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// ── Projects ──────────────────────────────────────────────

export const projects = sqliteTable("projects", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  type: text("type").notNull().default("personal"), // personal | mixed | kn
  status: text("status").notNull().default("active"), // active | paused | pending | archived
  description: text("description"),
  repos: text("repos"), // JSON array: ["https://github.com/..."]
  kpis: text("kpis"), // JSON object
  color: text("color").notNull().default("#6366f1"),
  icon: text("icon").notNull().default("Briefcase"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ── Contacts ──────────────────────────────────────────────

export const contacts = sqliteTable("contacts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  company: text("company"),
  source: text("source").notNull().default("otro"),
  temperature: text("temperature").notNull().default("cold"),
  score: integer("score").notNull().default(0),
  notes: text("notes"),
  projectId: text("project_id").references(() => projects.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ── Pipeline ──────────────────────────────────────────────

export const pipelineStages = sqliteTable("pipeline_stages", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  order: integer("order").notNull(),
  color: text("color").notNull().default("#64748b"),
  isWon: integer("is_won", { mode: "boolean" }).notNull().default(false),
  isLost: integer("is_lost", { mode: "boolean" }).notNull().default(false),
  projectId: text("project_id").references(() => projects.id),
});

// ── Deals ─────────────────────────────────────────────────

export const deals = sqliteTable("deals", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  value: integer("value").notNull().default(0),
  stageId: text("stage_id")
    .notNull()
    .references(() => pipelineStages.id),
  contactId: text("contact_id")
    .notNull()
    .references(() => contacts.id),
  expectedClose: integer("expected_close", { mode: "timestamp" }),
  probability: integer("probability").notNull().default(0),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ── Activities ────────────────────────────────────────────

export const activities = sqliteTable("activities", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  type: text("type").notNull(),
  description: text("description").notNull(),
  contactId: text("contact_id")
    .notNull()
    .references(() => contacts.id),
  dealId: text("deal_id").references(() => deals.id),
  projectId: text("project_id").references(() => projects.id),
  scheduledAt: integer("scheduled_at", { mode: "timestamp" }),
  completedAt: integer("completed_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ── Project Notes ─────────────────────────────────────────

export const projectNotes = sqliteTable("project_notes", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id),
  title: text("title").notNull().default(""),
  content: text("content").notNull(),
  category: text("category").notNull().default("idea"), // idea | decision | reference | meeting
  pinned: integer("pinned", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ── Next Steps ────────────────────────────────────────────

export const nextSteps = sqliteTable("next_steps", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id),
  title: text("title").notNull(),
  description: text("description"),
  priority: text("priority").notNull().default("medium"), // low | medium | high | urgent
  dueDate: integer("due_date", { mode: "timestamp" }),
  completedAt: integer("completed_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ── Agent Logs ────────────────────────────────────────────

export const agentLogs = sqliteTable("agent_logs", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  projectId: text("project_id").references(() => projects.id),
  agent: text("agent").notNull(), // organizador | vigilante
  type: text("type").notNull(), // transcription | parse | ci_fail | issue | pr | alert
  summary: text("summary").notNull(),
  payload: text("payload"), // JSON
  status: text("status").notNull().default("unread"), // unread | read | acted | dismissed
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ── Settings ──────────────────────────────────────────────

export const crmSettings = sqliteTable("crm_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});
