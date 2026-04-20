import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@drizzle/schema";

declare global {
  var __dbClient: ReturnType<typeof postgres> | undefined;
}

const client =
  globalThis.__dbClient ??
  (globalThis.__dbClient = postgres(process.env.DATABASE_URL!, {
    prepare: false,
  }));
export const db = drizzle(client, { schema });
