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

export const tenants = pgTable(
  "tenants",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    user_id: uuid("user_id").notNull(),
    local_id: uuid("local_id")
      .notNull()
      .references(() => locals.id, { onDelete: "cascade" }),
    is_current: boolean("is_current").default(false).notNull(),
    rental_start_date: date("rental_start_date").notNull(),
    rental_end_date: date("rental_end_date"),
    first_name: text("first_name").notNull(),
    last_name: text("last_name").notNull(),
    birth_date: date("birth_date"),
    email: text("email"),
    phone: text("phone"),
    cold_rent: numeric("cold_rent", { precision: 10, scale: 2 }).notNull(),
    additional_costs: numeric("additional_costs", {
      precision: 10,
      scale: 2,
    }).notNull(),
    deposit: numeric("deposit", { precision: 10, scale: 2 }),
    custody_type: text("custody_type"),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  () => [
    pgPolicy("Users can access their own tenants", {
      as: "permissive",
      for: "all",
      to: ["public"],
      using: sql`auth.uid() = user_id`,
      withCheck: sql`auth.uid() = user_id`,
    }),
  ]
);

export const documents = pgTable(
  "documents",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    user_id: uuid("user_id").notNull(),
    document_name: text("document_name").notNull(),
    document_url: text("document_url").notNull(),
    related_id: uuid("related_id").notNull(),
    related_type: text("related_type").notNull(),
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
      using: sql`auth.uid() = user_id`,
      withCheck: sql`auth.uid() = user_id`,
    }),
  ]
);
