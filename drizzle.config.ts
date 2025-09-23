import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});

export default defineConfig({
  out: "./src/db/drizzle",
  schema: "./src/db/drizzle/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    database: "postgres",
    port: 5432,
    host: "aws-0-eu-central-1.pooler.supabase.com",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  schemaFilter: ["public"],
  introspect: {
    casing: "preserve",
  },
  casing: "snake_case",
});
