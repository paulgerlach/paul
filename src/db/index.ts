import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./drizzle/schema";

import * as relations from "./drizzle/relations";

export const postgresClient = postgres(process.env.DATABASE_URL!, { prepare: false });

const database = drizzle(postgresClient, { schema: { ...schema, ...relations }, logger: true });

export default database;
