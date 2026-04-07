#!/usr/bin/env npx tsx

/**
 * Auto-CRM initialization script.
 * Creates the database, seeds default pipeline stages and projects,
 * and optionally seeds demo data.
 *
 * Usage:
 *   npx tsx scripts/init.ts          # Init only
 *   npx tsx scripts/init.ts --seed   # Init + demo data
 */

import crypto from "crypto";
import { createClient } from "@libsql/client";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";

async function main() {
  const isCloud = !!(process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN);
  const shouldSeed = process.argv.includes("--seed");

  let url: string;
  if (isCloud) {
    url = process.env.TURSO_DATABASE_URL!;
    console.log(`Initializing Auto-CRM (Turso cloud)...`);
  } else {
    const dbPath = path.join(process.cwd(), "data", "crm.db");
    const dataDir = path.dirname(dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    url = `file:${dbPath}`;
    console.log(`Initializing Auto-CRM...`);
    console.log(`Database: ${dbPath}`);
  }

  const client = createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  // ── Core tables ──────────────────────────────────────────

  await client.executeMultiple(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      type TEXT NOT NULL DEFAULT 'personal',
      status TEXT NOT NULL DEFAULT 'active',
      description TEXT,
      repos TEXT,
      kpis TEXT,
      color TEXT NOT NULL DEFAULT '#6366f1',
      icon TEXT NOT NULL DEFAULT 'Briefcase',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      company TEXT,
      source TEXT NOT NULL DEFAULT 'otro',
      temperature TEXT NOT NULL DEFAULT 'cold',
      score INTEGER NOT NULL DEFAULT 0,
      notes TEXT,
      project_id TEXT REFERENCES projects(id),
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS pipeline_stages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      "order" INTEGER NOT NULL,
      color TEXT NOT NULL DEFAULT '#64748b',
      is_won INTEGER NOT NULL DEFAULT 0,
      is_lost INTEGER NOT NULL DEFAULT 0,
      project_id TEXT REFERENCES projects(id)
    );

    CREATE TABLE IF NOT EXISTS deals (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      value INTEGER NOT NULL DEFAULT 0,
      stage_id TEXT NOT NULL REFERENCES pipeline_stages(id),
      contact_id TEXT NOT NULL REFERENCES contacts(id),
      expected_close INTEGER,
      probability INTEGER NOT NULL DEFAULT 0,
      notes TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS activities (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      description TEXT NOT NULL,
      contact_id TEXT NOT NULL REFERENCES contacts(id),
      deal_id TEXT REFERENCES deals(id),
      project_id TEXT REFERENCES projects(id),
      scheduled_at INTEGER,
      completed_at INTEGER,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS project_notes (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL REFERENCES projects(id),
      title TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'idea',
      pinned INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS next_steps (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL REFERENCES projects(id),
      title TEXT NOT NULL,
      description TEXT,
      priority TEXT NOT NULL DEFAULT 'medium',
      due_date INTEGER,
      completed_at INTEGER,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS agent_logs (
      id TEXT PRIMARY KEY,
      project_id TEXT REFERENCES projects(id),
      agent TEXT NOT NULL,
      type TEXT NOT NULL,
      summary TEXT NOT NULL,
      payload TEXT,
      status TEXT NOT NULL DEFAULT 'unread',
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS crm_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // ── Add project_id columns to existing tables (migration) ──

  const alterStatements = [
    "ALTER TABLE contacts ADD COLUMN project_id TEXT REFERENCES projects(id)",
    "ALTER TABLE pipeline_stages ADD COLUMN project_id TEXT REFERENCES projects(id)",
    "ALTER TABLE activities ADD COLUMN project_id TEXT REFERENCES projects(id)",
  ];

  for (const sql of alterStatements) {
    try {
      await client.execute(sql);
    } catch {
      // Column already exists — safe to ignore
    }
  }

  console.log("Tables created.");

  // ── Seed default pipeline stages ──────────────────────────

  const stageResult = await client.execute("SELECT COUNT(*) as count FROM pipeline_stages");
  const stageCount = Number(stageResult.rows[0]?.count ?? 0);

  if (stageCount === 0) {
    const defaultStages = [
      { name: "Prospecto", order: 1, color: "#64748b", isWon: 0, isLost: 0 },
      { name: "Contactado", order: 2, color: "#2563eb", isWon: 0, isLost: 0 },
      { name: "Propuesta", order: 3, color: "#8b5cf6", isWon: 0, isLost: 0 },
      { name: "Negociacion", order: 4, color: "#ea580c", isWon: 0, isLost: 0 },
      { name: "Cerrado Ganado", order: 5, color: "#16a34a", isWon: 1, isLost: 0 },
      { name: "Cerrado Perdido", order: 6, color: "#dc2626", isWon: 0, isLost: 1 },
    ];

    for (const stage of defaultStages) {
      await client.execute({
        sql: `INSERT OR IGNORE INTO pipeline_stages (id, name, "order", color, is_won, is_lost) VALUES (?, ?, ?, ?, ?, ?)`,
        args: [crypto.randomUUID(), stage.name, stage.order, stage.color, stage.isWon, stage.isLost],
      });
    }
    console.log("Default pipeline stages created.");
  } else {
    console.log("Pipeline stages already exist, skipping.");
  }

  // ── Seed IS projects ──────────────────────────────────────

  const projectResult = await client.execute("SELECT COUNT(*) as count FROM projects");
  const projectCount = Number(projectResult.rows[0]?.count ?? 0);

  if (projectCount === 0) {
    const now = Math.floor(Date.now() / 1000);
    const defaultProjects = [
      {
        name: "FG Performance (Coach OS)",
        slug: "fg-performance",
        type: "personal",
        status: "active",
        description: "Plataforma para entrenadores y coaches independientes. Tracking de rendimiento, planes de entrenamiento, dashboard corporativo.",
        repos: JSON.stringify(["https://github.com/franciscogs10-svg/fg-performance"]),
        color: "#10b981",
        icon: "Dumbbell",
      },
      {
        name: "Casino Online",
        slug: "casino",
        type: "personal",
        status: "active",
        description: "Plataforma white-label de casino online. Socio: Lucas. Mercado: Ecuador/Venezuela.",
        repos: JSON.stringify(["https://github.com/franciscogs10-svg/casino-online-is"]),
        color: "#f59e0b",
        icon: "Dice5",
      },
      {
        name: "KN Training Factory",
        slug: "kn-training",
        type: "mixed",
        status: "active",
        description: "Generador de contenido de capacitacion corporativa. Piloto con Kuehne+Nagel, escalable a empresas grandes.",
        repos: JSON.stringify(["https://github.com/franciscogs10-svg/Training-factory-project"]),
        color: "#3b82f6",
        icon: "GraduationCap",
      },
      {
        name: "ProduccionIS",
        slug: "produccion-is",
        type: "personal",
        status: "pending",
        description: "Sistema de control de produccion para restaurantes. Input por voz, tracking de desperdicios, dashboard de dueno. Piloto: Sushimoto.",
        repos: JSON.stringify(["https://github.com/franciscogs10-svg/ProduccionIS"]),
        color: "#8b5cf6",
        icon: "ChefHat",
      },
    ];

    for (const p of defaultProjects) {
      await client.execute({
        sql: `INSERT OR IGNORE INTO projects (id, name, slug, type, status, description, repos, color, icon, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [crypto.randomUUID(), p.name, p.slug, p.type, p.status, p.description, p.repos, p.color, p.icon, now, now],
      });
    }
    console.log("IS projects seeded (4 projects).");
  } else {
    console.log("Projects already exist, skipping.");
  }

  // ── Copy default config ────────────────────────────────────

  const configPath = path.join(process.cwd(), "crm-config.json");
  const defaultConfigPath = path.join(process.cwd(), "public", "crm-config.json");
  if (!fs.existsSync(configPath) && fs.existsSync(defaultConfigPath)) {
    fs.copyFileSync(defaultConfigPath, configPath);
    console.log("Default crm-config.json created.");
  }

  client.close();

  if (shouldSeed) {
    console.log("\nSeeding demo data...");
    execSync("npx tsx src/db/seed.ts", { stdio: "inherit", cwd: process.cwd() });
  }

  console.log("\nAuto-CRM initialized successfully!");
  console.log("Run 'npm run dev' to start the development server.");
  console.log("Open http://localhost:3000 to access your CRM.");
}

main().catch((err) => {
  console.error("Init failed:", err);
  process.exit(1);
});
