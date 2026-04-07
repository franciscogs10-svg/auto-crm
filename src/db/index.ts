import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import path from "path";
import fs from "fs";

const isCloud = !!(process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN);

let url: string;
if (isCloud) {
  url = process.env.TURSO_DATABASE_URL!;
} else {
  // Local fallback: use file-based SQLite
  const dbPath = path.join(process.cwd(), "data", "crm.db");
  const dataDir = path.dirname(dbPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  url = `file:${dbPath}`;
}

const client = createClient({
  url,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
