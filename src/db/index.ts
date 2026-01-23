import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./drizzle/schema";

export const postgresClient = postgres(process.env.DATABASE_URL!, { prepare: false });

const database = drizzle(postgresClient, { schema, logger: true });

export default database;
