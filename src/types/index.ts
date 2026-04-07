export type Temperature = "cold" | "warm" | "hot";

export type ActivityType = "call" | "email" | "meeting" | "note" | "follow_up";

export type LeadSource =
  | "website"
  | "whatsapp"
  | "referido"
  | "redes_sociales"
  | "llamada_fria"
  | "email"
  | "formulario"
  | "evento"
  | "import"
  | "webhook"
  | "otro";

export interface Contact {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  source: LeadSource;
  temperature: Temperature;
  score: number;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Deal {
  id: string;
  title: string;
  value: number; // in cents
  stageId: string;
  contactId: string;
  expectedClose: Date | null;
  probability: number; // 0-100
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  color: string;
  isWon: boolean;
  isLost: boolean;
}

export interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  contactId: string;
  dealId: string | null;
  scheduledAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
}

export interface CrmConfig {
  business: {
    type: string;
    industry: string;
    teamSize: string;
  };
  pipeline: {
    stages: Array<{
      name: string;
      order: number;
      color: string;
      isWon: boolean;
      isLost: boolean;
    }>;
  };
  leadSources: string[];
  preferences: {
    language: "es" | "en";
    theme: "light" | "dark" | "auto";
  };
}

// API response types
export interface DealWithContact extends Deal {
  contact?: Contact;
  stage?: PipelineStage;
  contactName?: string | null;
  contactTemperature?: string | null;
}

export interface ContactWithDeals extends Contact {
  deals?: Deal[];
  activities?: Activity[];
}

export interface PipelineColumn extends PipelineStage {
  deals: DealWithContact[];
}

export interface DashboardStats {
  totalContacts: number;
  activeDeals: number;
  totalPipelineValue: number;
  wonDealsValue: number;
  conversionRate: number;
  hotLeads: number;
}

// ── Projects ──────────────────────────────────────────────

export type ProjectType = "personal" | "mixed" | "kn";
export type ProjectStatus = "active" | "paused" | "pending" | "archived";
export type NoteCategory = "idea" | "decision" | "reference" | "meeting";
export type StepPriority = "low" | "medium" | "high" | "urgent";
export type AgentName = "organizador" | "vigilante";
export type AgentLogStatus = "unread" | "read" | "acted" | "dismissed";

export interface Project {
  id: string;
  name: string;
  slug: string;
  type: ProjectType;
  status: ProjectStatus;
  description: string | null;
  repos: string | null; // JSON array
  kpis: string | null; // JSON object
  color: string;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectNote {
  id: string;
  projectId: string;
  title: string;
  content: string;
  category: NoteCategory;
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NextStep {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  priority: StepPriority;
  dueDate: Date | null;
  completedAt: Date | null;
  createdAt: Date;
}

export interface AgentLog {
  id: string;
  projectId: string | null;
  agent: AgentName;
  type: string;
  summary: string;
  payload: string | null; // JSON
  status: AgentLogStatus;
  createdAt: Date;
}

export interface ProjectWithStats extends Project {
  nextStep?: NextStep | null;
  lastActivity?: Date | null;
  alertCount?: number;
  contactCount?: number;
  dealCount?: number;
  pipelineValue?: number;
}

export interface VoiceParseResult {
  project: string; // slug
  actionType: "note" | "next_step" | "activity" | "contact" | "deal";
  content: {
    title: string;
    description?: string;
    priority?: StepPriority;
    dueDate?: string;
  };
  confidence: number;
}
