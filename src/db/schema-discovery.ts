import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Projects - cada proyecto de producto/feature que estás descubriendo
export const discoveryProjects = sqliteTable('discovery_projects', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  businessGoal: text('business_goal'), // El goal principal del negocio
  status: text('status').notNull().default('active'), // active, paused, completed, archived
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// Opportunities - oportunidades identificadas del Opportunity Solution Tree
export const opportunities = sqliteTable('opportunities', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  projectId: integer('project_id').notNull().references(() => discoveryProjects.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  outcome: text('outcome'), // El outcome esperado
  priority: text('priority').default('medium'), // high, medium, low
  status: text('status').default('open'), // open, exploring, validated, discarded
  parentId: integer('parent_id'), // Para jerarquía (outcome -> opportunity)
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// Solutions - soluciones propuestas para opportunities
export const solutions = sqliteTable('solutions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  opportunityId: integer('opportunity_id').notNull().references(() => opportunities.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  status: text('status').default('proposed'), // proposed, testing, validated, implemented, discarded
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// Story Maps - mapeo de user journeys
export const storyMaps = sqliteTable('story_maps', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  projectId: integer('project_id').notNull().references(() => discoveryProjects.id, { onDelete: 'cascade' }),
  solutionId: integer('solution_id').references(() => solutions.id, { onDelete: 'cascade' }),
  persona: text('persona').notNull(), // Ej: "Warehouse Manager"
  step: text('step').notNull(), // Paso del journey: "Receive alerts"
  order: integer('order').notNull().default(0), // Para ordenar los pasos
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// Assumptions - assumptions sobre cada paso del story map
export const assumptions = sqliteTable('assumptions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  projectId: integer('project_id').notNull().references(() => discoveryProjects.id, { onDelete: 'cascade' }),
  solutionId: integer('solution_id').references(() => solutions.id, { onDelete: 'set null' }),
  storyMapId: integer('story_map_id').references(() => storyMaps.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  description: text('description'),
  type: text('type').notNull(), // value, usability, feasibility
  importance: text('importance').notNull(), // important, unimportant
  certainty: text('certainty').notNull(), // known, unknown
  status: text('status').default('untested'), // untested, testing, validated, invalidated
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// Experiments - experimentos para validar assumptions
export const experiments = sqliteTable('experiments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  assumptionId: integer('assumption_id').notNull().references(() => assumptions.id, { onDelete: 'cascade' }),
  method: text('method').notNull(), // prototype, survey, data_mining, research_spike, wizard_of_oz, etc
  methodDescription: text('method_description'), // Detalles del método
  behaviorExpected: text('behavior_expected'), // Qué comportamiento esperamos ver
  successCriteria: text('success_criteria'), // Criterio de éxito
  result: text('result'), // Resultado del experimento
  learnings: text('learnings'), // Qué aprendimos
  nextIteration: text('next_iteration'), // Próximos pasos
  status: text('status').default('planned'), // planned, running, completed, cancelled
  startDate: integer('start_date', { mode: 'timestamp' }),
  endDate: integer('end_date', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// Interview Notes - notas de entrevistas con usuarios
export const interviewNotes = sqliteTable('interview_notes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  projectId: integer('project_id').notNull().references(() => discoveryProjects.id, { onDelete: 'cascade' }),
  intervieweeName: text('interviewee_name'),
  intervieweeRole: text('interviewee_role'),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  quote: text('quote'), // Una cita memorable
  keyInfo: text('key_info'), // Info clave sobre el entrevistado (JSON)
  insights: text('insights'), // Insights y facts observados (JSON)
  opportunities: text('opportunities'), // Oportunidades identificadas (JSON)
  tags: text('tags'), // Tags para categorizar (comma-separated)
  rawNotes: text('raw_notes'), // Notas completas
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// Insights - insights extraídos de interviews que pueden linkear a opportunities
export const insights = sqliteTable('insights', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  projectId: integer('project_id').notNull().references(() => discoveryProjects.id, { onDelete: 'cascade' }),
  interviewId: integer('interview_id').references(() => interviewNotes.id, { onDelete: 'set null' }),
  opportunityId: integer('opportunity_id').references(() => opportunities.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  description: text('description'),
  type: text('type').default('behavioral'), // behavioral, pain_point, desire, context
  source: text('source'), // De dónde vino: interview, observation, data, etc
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
