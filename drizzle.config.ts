import { defineConfig } from "drizzle-kit";

const isCloud = !!(process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN);

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "turso",
  dbCredentials: isCloud
    ? {
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN!,
      }
    : {
        url: "file:./data/crm.db",
      },
});
