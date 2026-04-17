import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@drizzle/schema";

declare global {
  var __dbClient: ReturnType<typeof postgres> | undefined;
}

/**
 * Validates and returns the DATABASE_URL environment variable
 * Throws a clear error if missing or misconfigured
 */
function getDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "Missing DATABASE_URL environment variable. Set DATABASE_URL in frontend/.env.local",
    );
  }

  if (databaseUrl.trim() === "") {
    throw new Error(
      "DATABASE_URL is empty. Ensure it contains a valid PostgreSQL connection string in frontend/.env.local",
    );
  }

  return databaseUrl;
}

/**
 * Lazily creates and returns the database client
 * Only validates environment variables when the client is first accessed
 */
function getDbClient(): ReturnType<typeof postgres> {
  if (globalThis.__dbClient) {
    return globalThis.__dbClient;
  }

  const databaseUrl = getDatabaseUrl();
  globalThis.__dbClient = postgres(databaseUrl);
  return globalThis.__dbClient;
}

export const db = drizzle(getDbClient(), { schema });
