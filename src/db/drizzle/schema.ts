import {
  pgTable,
  foreignKey,
  pgPolicy,
  uuid,
  text,
  timestamp,
  varchar,
  boolean,
  jsonb,
  integer,
  date,
  numeric,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable(
  "users",
  {
    id: uuid().primaryKey().notNull(),
    first_name: text(),
    last_name: text(),
    email: text(),
    created_at: timestamp({ withTimezone: true, mode: "string" }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.id],
      foreignColumns: [table.id],
      name: "users_id_fkey",
    }).onDelete("cascade"),
    pgPolicy("User can manage own profile", {
      as: "permissive",
      for: "all",
      to: ["authenticated"],
      using: sql`auth.uid() = id`,
      withCheck: sql`auth.uid() = id`,
    }),
    pgPolicy("Users can access their own record", {
      as: "permissive",
      for: "all",
      to: ["authenticated"],
      using: sql`(auth.uid() = id)`,
    }),
  ]
);

export const usersInAuth = pgTable("users_in_auth", {
  id: uuid().primaryKey().notNull(),
  user_id: uuid().notNull(),
});

export const objekte = pgTable(
  "objekte",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    user_id: uuid("user_id").notNull(),

    objekt_type: text("objekt_type").notNull(),
    street: varchar("street", { length: 255 }).notNull(),
    zip: varchar("zip", { length: 20 }).notNull(),
    administration_type: text("administration_type").notNull(),
    hot_water_preparation: text("hot_water_preparation").notNull(),

    living_area: integer("living_area"),
    usable_area: integer("usable_area"),
    land_area: integer("land_area"),
    build_year: integer("build_year"),
    has_elevator: boolean("has_elevator").default(false),

    tags: jsonb("tags").$type<string[]>().default([]),
    heating_systems: jsonb("heating_systems").$type<string[]>().default([]),

    created_at: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
  },
  () => [
    pgPolicy("Users can access only their own objects", {
      as: "permissive",
      for: "all",
      to: ["public"],
      using: sql`(auth.uid() = user_id)`,
      withCheck: sql`(auth.uid() = user_id)`,
    }),
  ]
);

export const locals = pgTable(
  "locals",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    objekt_id: uuid("objekt_id")
      .notNull()
      .references(() => objekte.id, { onDelete: "cascade" }),

    usage_type: text("usage_type").notNull(),
    floor: text("floor").notNull(),
    living_space: numeric("living_space").notNull(),
    house_location: text("house_location"),
    outdoor: text("outdoor"),
    rooms: numeric("rooms"),
    house_fee: numeric("house_fee"),
    outdoor_area: numeric("outdoor_area"),
    residential_area: text("residential_area"),
    apartment_type: text("apartment_type"),
    cellar_available: boolean("cellar_available"),
    tags: jsonb("tags").$type<string[]>(),
    heating_systems: jsonb("heating_systems").$type<string[]>(),

    created_at: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
  },
  () => [
    // 🔐 Row-level security policy
    pgPolicy("Users can access their own locals", {
      as: "permissive",
      for: "all",
      to: ["public"],
      using: sql`
          EXISTS (
            SELECT 1
            FROM objekte
            WHERE objekte.id = locals.objekt_id
            AND objekte.user_id = auth.uid()
          )
        `,
      withCheck: sql`
          EXISTS (
            SELECT 1
            FROM objekte
            WHERE objekte.id = locals.objekt_id
            AND objekte.user_id = auth.uid()
          )
        `,
    }),
  ]
);

export const localHistory = pgTable(
  "local_history",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    local_id: uuid("local_id")
      .notNull()
      .references(() => locals.id, { onDelete: "cascade" }),

    start_date: date("start_date").notNull(),
    end_date: date("end_date").notNull(),

    last_name: varchar("last_name", { length: 255 }).notNull(),
    first_name: varchar("first_name", { length: 255 }).notNull(),

    price_per_month: integer("price_per_month").notNull(),

    active: boolean("active").default(false),
    days: integer("days").notNull(),

    created_at: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
  },
  () => [
    pgPolicy("Users can access their own local history", {
      as: "permissive",
      for: "all",
      to: ["public"],
      using: sql`
          EXISTS (
            SELECT 1
            FROM locals
            JOIN objekte ON objekte.id = locals.objekt_id
            WHERE locals.id = local_history.local_id
            AND objekte.user_id = auth.uid()
          )
        `,
      withCheck: sql`
          EXISTS (
            SELECT 1
            FROM locals
            JOIN objekte ON objekte.id = locals.objekt_id
            WHERE locals.id = local_history.local_id
            AND objekte.user_id = auth.uid()
          )
        `,
    }),
  ]
);

export const documents = pgTable(
  "documents",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    document_name: text("document_name").notNull(),
    document_url: text("document_url").notNull(),

    related_id: uuid("related_id").notNull(),
    related_type: text("related_type").notNull(), // 'objekt', 'local', or 'local_history'

    created_at: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
  },
  () => [
    pgPolicy("Users can access only their own documents", {
      as: "permissive",
      for: "all",
      to: ["public"],
      using: sql`
        (
          (related_type = 'objekt' AND EXISTS (
            SELECT 1 FROM objekte
            WHERE objekte.id = documents.related_id
            AND objekte.user_id = auth.uid()
          ))
          OR
          (related_type = 'local' AND EXISTS (
            SELECT 1 FROM locals
            JOIN objekte ON objekte.id = locals.objekt_id
            WHERE locals.id = documents.related_id
            AND objekte.user_id = auth.uid()
          ))
          OR
          (related_type = 'local_history' AND EXISTS (
            SELECT 1 FROM local_history
            JOIN locals ON locals.id = local_history.local_id
            JOIN objekte ON objekte.id = locals.objekt_id
            WHERE local_history.id = documents.related_id
            AND objekte.user_id = auth.uid()
          ))
        )
      `,
      withCheck: sql`
        (
          (related_type = 'objekt' AND EXISTS (
            SELECT 1 FROM objekte
            WHERE objekte.id = documents.related_id
            AND objekte.user_id = auth.uid()
          ))
          OR
          (related_type = 'local' AND EXISTS (
            SELECT 1 FROM locals
            JOIN objekte ON objekte.id = locals.objekt_id
            WHERE locals.id = documents.related_id
            AND objekte.user_id = auth.uid()
          ))
          OR
          (related_type = 'local_history' AND EXISTS (
            SELECT 1 FROM local_history
            JOIN locals ON locals.id = local_history.local_id
            JOIN objekte ON objekte.id = locals.objekt_id
            WHERE local_history.id = documents.related_id
            AND objekte.user_id = auth.uid()
          ))
        )
      `,
    }),
  ]
);
