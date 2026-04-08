// Types for Product Discovery & Experimentation

export type ProjectStatus = 'active' | 'paused' | 'completed' | 'archived';

export type DiscoveryProject = {
  id: number;
  name: string;
  description?: string;
  businessGoal?: string;
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type OpportunityStatus = 'open' | 'exploring' | 'validated' | 'discarded';
export type Priority = 'high' | 'medium' | 'low';

export type Opportunity = {
  id: number;
  projectId: number;
  title: string;
  description?: string;
  outcome?: string;
  priority: Priority;
  status: OpportunityStatus;
  parentId?: number;
  createdAt: Date;
  updatedAt: Date;
};

export type SolutionStatus = 'proposed' | 'testing' | 'validated' | 'implemented' | 'discarded';

export type Solution = {
  id: number;
  opportunityId: number;
  title: string;
  description?: string;
  status: SolutionStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type StoryMap = {
  id: number;
  projectId: number;
  solutionId?: number;
  persona: string;
  step: string;
  order: number;
  createdAt: Date;
};

export type AssumptionType = 'value' | 'usability' | 'feasibility';
export type Importance = 'important' | 'unimportant';
export type Certainty = 'known' | 'unknown';
export type AssumptionStatus = 'untested' | 'testing' | 'validated' | 'invalidated';

export type Assumption = {
  id: number;
  projectId: number;
  solutionId?: number;
  storyMapId?: number;
  title: string;
  description?: string;
  type: AssumptionType;
  importance: Importance;
  certainty: Certainty;
  status: AssumptionStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type ExperimentMethod =
  | 'prototype'
  | 'survey'
  | 'data_mining'
  | 'research_spike'
  | 'wizard_of_oz'
  | 'concierge'
  | 'landing_page'
  | 'fake_door'
  | 'ab_test'
  | 'other';

export type ExperimentStatus = 'planned' | 'running' | 'completed' | 'cancelled';

export type Experiment = {
  id: number;
  assumptionId: number;
  method: ExperimentMethod;
  methodDescription?: string;
  behaviorExpected?: string;
  successCriteria?: string;
  result?: string;
  learnings?: string;
  nextIteration?: string;
  status: ExperimentStatus;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type InterviewNote = {
  id: number;
  projectId: number;
  intervieweeName?: string;
  intervieweeRole?: string;
  date: Date;
  quote?: string;
  keyInfo?: string; // JSON string
  insights?: string; // JSON string
  opportunities?: string; // JSON string
  tags?: string;
  rawNotes?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type InsightType = 'behavioral' | 'pain_point' | 'desire' | 'context';

export type Insight = {
  id: number;
  projectId: number;
  interviewId?: number;
  opportunityId?: number;
  title: string;
  description?: string;
  type: InsightType;
  source?: string;
  createdAt: Date;
};

// Helper types for creating new records
export type NewDiscoveryProject = Omit<DiscoveryProject, 'id' | 'createdAt' | 'updatedAt'>;
export type NewOpportunity = Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>;
export type NewSolution = Omit<Solution, 'id' | 'createdAt' | 'updatedAt'>;
export type NewAssumption = Omit<Assumption, 'id' | 'createdAt' | 'updatedAt'>;
export type NewExperiment = Omit<Experiment, 'id' | 'createdAt' | 'updatedAt'>;
export type NewInterviewNote = Omit<InterviewNote, 'id' | 'createdAt' | 'updatedAt'>;
