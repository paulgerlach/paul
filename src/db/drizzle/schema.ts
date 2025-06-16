import {
  pgTable,
  foreignKey,
  pgPolicy,
  uuid,
  timestamp,
  text,
  numeric,
  boolean,
  jsonb,
  date,
  varchar,
  integer,
  unique,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const locals = pgTable(
  "locals",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    objekt_id: uuid().notNull(),
    created_at: timestamp({ withTimezone: true, mode: "string" }).defaultNow(),
    usage_type: text().notNull(),
    floor: text().notNull(),
    living_space: numeric().notNull(),
    house_location: text(),
    outdoor: text(),
    rooms: numeric(),
    house_fee: numeric(),
    outdoor_area: numeric(),
    residential_area: text(),
    apartment_type: text(),
    cellar_available: boolean(),
    tags: jsonb(),
    heating_systems: jsonb(),
  },
  (table) => [
    foreignKey({
      columns: [table.objekt_id],
      foreignColumns: [objekte.id],
      name: "locals_objekt_id_objekte_id_fk",
    }).onDelete("cascade"),
    pgPolicy("Users can access their own locals", {
      as: "permissive",
      for: "all",
      to: ["public"],
      using: sql`(EXISTS ( SELECT 1
   FROM objekte
  WHERE ((objekte.id = locals.objekt_id) AND (objekte.user_id = auth.uid()))))`,
      withCheck: sql`(EXISTS ( SELECT 1
   FROM objekte
  WHERE ((objekte.id = locals.objekt_id) AND (objekte.user_id = auth.uid()))))`,
    }),
  ]
);

export const documents = pgTable(
  "documents",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    document_name: text().notNull(),
    document_url: text().notNull(),
    related_id: uuid().notNull(),
    related_type: text().notNull(),
    created_at: timestamp({ withTimezone: true, mode: "string" }).defaultNow(),
    user_id: uuid().notNull(),
  },
  (table) => [
    pgPolicy("Users can insert their own documents", {
      as: "permissive",
      for: "insert",
      to: ["public"],
      withCheck: sql`(user_id = auth.uid())`,
    }),
    pgPolicy("Users can select their own documents", {
      as: "permissive",
      for: "select",
      to: ["public"],
    }),
    pgPolicy("User can access their own documents", {
      as: "permissive",
      for: "all",
      to: ["public"],
    }),
  ]
);

export const contracts = pgTable(
  "contracts",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    user_id: uuid().notNull(),
    local_id: uuid().notNull(),
    is_current: boolean().default(false).notNull(),
    rental_start_date: date().notNull(),
    rental_end_date: date(),
    cold_rent: numeric({ precision: 10, scale: 2 }).notNull(),
    additional_costs: numeric({ precision: 10, scale: 2 }).notNull(),
    deposit: numeric({ precision: 10, scale: 2 }),
    custody_type: text(),
    created_at: timestamp({ withTimezone: true, mode: "string" }).notNull(),
    updated_at: timestamp({ withTimezone: true, mode: "string" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.local_id],
      foreignColumns: [locals.id],
      name: "contracts_local_id_locals_id_fk",
    }).onDelete("cascade"),
    pgPolicy("Users can access their own contracts", {
      as: "permissive",
      for: "all",
      to: ["public"],
      using: sql`(auth.uid() = user_id)`,
      withCheck: sql`(auth.uid() = user_id)`,
    }),
  ]
);

export const contractors = pgTable(
  "contractors",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    user_id: uuid().notNull(),
    contract_id: uuid().notNull(),
    first_name: text().notNull(),
    last_name: text().notNull(),
    birth_date: date(),
    email: text(),
    phone: text(),
    created_at: timestamp({ withTimezone: true, mode: "string" }).notNull(),
    updated_at: timestamp({ withTimezone: true, mode: "string" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.contract_id],
      foreignColumns: [contracts.id],
      name: "contractors_contract_id_contracts_id_fk",
    }).onDelete("cascade"),
    pgPolicy("Users can access their own contractors", {
      as: "permissive",
      for: "all",
      to: ["public"],
      using: sql`(EXISTS ( SELECT 1
   FROM contracts
  WHERE ((contracts.id = contractors.contract_id) AND (contracts.user_id = auth.uid()))))`,
      withCheck: sql`(EXISTS ( SELECT 1
   FROM contracts
  WHERE ((contracts.id = contractors.contract_id) AND (contracts.user_id = auth.uid()))))`,
    }),
  ]
);

export const objekte = pgTable(
  "objekte",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    user_id: uuid().notNull(),
    objekt_type: text().notNull(),
    street: varchar({ length: 255 }).notNull(),
    zip: varchar({ length: 20 }).notNull(),
    administration_type: text().notNull(),
    hot_water_preparation: text().notNull(),
    living_area: integer(),
    usable_area: integer(),
    land_area: integer(),
    build_year: integer(),
    has_elevator: boolean().default(false),
    tags: jsonb().default([]),
    heating_systems: jsonb().default([]),
    created_at: timestamp({ withTimezone: true, mode: "string" }).defaultNow(),
  },
  (table) => [
    pgPolicy("Users can access only their own objects", {
      as: "permissive",
      for: "all",
      to: ["public"],
      using: sql`(auth.uid() = user_id)`,
      withCheck: sql`(auth.uid() = user_id)`,
    }),
  ]
);

export const heating_bill_documents = pgTable(
  "heating_bill_documents",
  {
    created_at: timestamp({ withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    document_name: text(),
    objekt_id: uuid().defaultRandom().notNull(),
    local_id: uuid().defaultRandom().notNull(),
    user_id: uuid()
      .default(sql`auth.uid()`)
      .notNull(),
    cost_type: text(),
    id: uuid().primaryKey().notNull(),
    invoice_date: date(),
    total_amount: numeric(),
    service_period: boolean(),
    for_all_tenants: boolean(),
    purpose: text(),
    notes: text(),
  },
  (table) => [
    foreignKey({
      columns: [table.local_id],
      foreignColumns: [locals.id],
      name: "heating_bill_documents_local_id_fkey",
    }),
    foreignKey({
      columns: [table.objekt_id],
      foreignColumns: [objekte.id],
      name: "heating_bill_documents_objekt_id_fkey",
    }),
    unique("heating_bill_documents_objekt_id_key").on(table.objekt_id),
    unique("heating_bill_documents_local_id_key").on(table.local_id),
    unique("heating_bill_documents_user_id_key").on(table.user_id),
    pgPolicy("Allow users to SELECT their own heating bill documents", {
      as: "permissive",
      for: "select",
      to: ["public"],
      using: sql`(user_id = auth.uid())`,
    }),
    pgPolicy("Allow users to INSERT their own heating bill documents", {
      as: "permissive",
      for: "insert",
      to: ["public"],
    }),
    pgPolicy("Allow users to UPDATE their own heating bill documents", {
      as: "permissive",
      for: "update",
      to: ["public"],
    }),
    pgPolicy("Allow users to DELETE their own heating bill documents", {
      as: "permissive",
      for: "delete",
      to: ["public"],
    }),
  ]
);
