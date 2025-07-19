import { pgTable, foreignKey, uuid, timestamp, boolean, numeric, pgPolicy, text, jsonb, date, unique, varchar, integer, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const doc_cost_category_allocation_key = pgEnum("doc_cost_category_allocation_key", ['Wohneinheiten', 'Verbrauch', 'm2 Wohnfläche'])
export const doc_cost_category_document_type = pgEnum("doc_cost_category_document_type", ['heizkostenabrechnung', 'betriebskostenabrechnung'])


export const heating_bill_documents = pgTable("heating_bill_documents", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	start_date: timestamp({ withTimezone: true, mode: 'string' }),
	end_date: timestamp({ withTimezone: true, mode: 'string' }),
	objekt_id: uuid().defaultRandom(),
	user_id: uuid(),
	submited: boolean(),
	local_id: uuid().defaultRandom(),
	consumption_dependent: numeric().default('70'),
	living_space_share: numeric().default('30'),
}, (table) => [
	foreignKey({
		columns: [table.local_id],
		foreignColumns: [locals.id],
		name: "heating_bill_documents_local_id_fkey"
	}),
	foreignKey({
		columns: [table.objekt_id],
		foreignColumns: [objekte.id],
		name: "heating_bill_documents_objekt_id_fkey1"
	}),
]);

export const doc_cost_category = pgTable("doc_cost_category", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }),
	type: text(),
	name: text(),
	options: text().array(),
	allocation_key: doc_cost_category_allocation_key().default('Verbrauch'),
	document_type: doc_cost_category_document_type(),
	user_id: uuid(),
}, (table) => [
	pgPolicy("Users can update their own doc_cost_category", { as: "permissive", for: "update", to: ["public"], using: sql`(auth.uid() = user_id)` }),
	pgPolicy("Users can insert their own doc_cost_category", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("Users can delete their own doc_cost_category", { as: "permissive", for: "delete", to: ["public"] }),
	pgPolicy("Admins can update all, users only their own", { as: "permissive", for: "update", to: ["public"] }),
	pgPolicy("Users can select their own doc_cost_category", { as: "permissive", for: "select", to: ["public"] }),
]);

export const operating_cost_documents = pgTable("operating_cost_documents", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	start_date: timestamp({ withTimezone: true, mode: 'string' }),
	end_date: timestamp({ withTimezone: true, mode: 'string' }),
	objekt_id: uuid().defaultRandom(),
	user_id: uuid(),
	submited: boolean().default(false).notNull(),
}, (table) => [
	foreignKey({
		columns: [table.objekt_id],
		foreignColumns: [objekte.id],
		name: "operating_cost_documents_objekt_id_fkey"
	}),
]);

export const locals = pgTable("locals", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	objekt_id: uuid().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow(),
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
}, (table) => [
	foreignKey({
		columns: [table.objekt_id],
		foreignColumns: [objekte.id],
		name: "locals_objekt_id_objekte_id_fk"
	}).onDelete("cascade"),
	pgPolicy("Users can access their own locals", {
		as: "permissive", for: "all", to: ["public"], using: sql`(EXISTS ( SELECT 1
   FROM objekte
  WHERE ((objekte.id = locals.objekt_id) AND (objekte.user_id = auth.uid()))))`, withCheck: sql`(EXISTS ( SELECT 1
   FROM objekte
  WHERE ((objekte.id = locals.objekt_id) AND (objekte.user_id = auth.uid()))))`  }),
]);

export const documents = pgTable("documents", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	document_name: text().notNull(),
	document_url: text().notNull(),
	related_id: uuid().notNull(),
	related_type: text().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow(),
	user_id: uuid().notNull(),
}, (table) => [
	pgPolicy("Admins can update all, users only their own", { as: "permissive", for: "update", to: ["public"], using: sql`((user_id = auth.uid()) OR is_admin())` }),
	pgPolicy("Users can insert their own documents", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("Users can select their own documents", { as: "permissive", for: "select", to: ["public"] }),
	pgPolicy("User can access their own documents", { as: "permissive", for: "all", to: ["public"] }),
]);

export const contracts = pgTable("contracts", {
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
	created_at: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
		columns: [table.local_id],
		foreignColumns: [locals.id],
		name: "contracts_local_id_locals_id_fk"
	}).onDelete("cascade"),
	pgPolicy("Admins can update all, users only their own", { as: "permissive", for: "update", to: ["public"], using: sql`((user_id = auth.uid()) OR is_admin())` }),
	pgPolicy("Users can access their own contracts", { as: "permissive", for: "all", to: ["public"] }),
]);

export const contractors = pgTable("contractors", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	user_id: uuid().notNull(),
	contract_id: uuid().notNull(),
	first_name: text().notNull(),
	last_name: text().notNull(),
	birth_date: date(),
	email: text(),
	phone: text(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
		columns: [table.contract_id],
		foreignColumns: [contracts.id],
		name: "contractors_contract_id_contracts_id_fk"
	}).onDelete("cascade"),
	pgPolicy("Admins can update all, users only their own", { as: "permissive", for: "update", to: ["public"], using: sql`((user_id = auth.uid()) OR is_admin())` }),
	pgPolicy("Users can access their own contractors", { as: "permissive", for: "all", to: ["public"] }),
]);

export const users_in_auth = pgTable("users_in_auth", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: text().notNull(),
	hashed_password: text().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("users_in_auth_email_key").on(table.email),
	pgPolicy("Users can view their own auth info", { as: "permissive", for: "select", to: ["public"], using: sql`(id = auth.uid())` }),
	pgPolicy("Users can update their own auth info", { as: "permissive", for: "update", to: ["public"] }),
]);

export const invoice_documents = pgTable("invoice_documents", {
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	document_name: text(),
	objekt_id: uuid().defaultRandom().notNull(),
	user_id: uuid().default(sql`auth.uid()`).notNull(),
	cost_type: text(),
	id: uuid().defaultRandom().primaryKey().notNull(),
	invoice_date: date(),
	total_amount: numeric(),
	service_period: boolean(),
	for_all_tenants: boolean(),
	purpose: text(),
	notes: text(),
	operating_doc_id: uuid(),
	direct_local_id: uuid().array(),
}, (table) => [
	foreignKey({
		columns: [table.objekt_id],
		foreignColumns: [objekte.id],
		name: "heating_bill_documents_objekt_id_fkey"
	}),
	foreignKey({
		columns: [table.operating_doc_id],
		foreignColumns: [operating_cost_documents.id],
		name: "invoice_documents_operating_doc_id_fkey"
	}),
	unique("heating_bill_documents_objekt_id_key").on(table.objekt_id),
	unique("heating_bill_documents_user_id_key").on(table.user_id),
	pgPolicy("Allow users to SELECT their own heating bill documents", { as: "permissive", for: "select", to: ["public"], using: sql`(user_id = auth.uid())` }),
	pgPolicy("Allow users to INSERT their own heating bill documents", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("Allow users to UPDATE their own heating bill documents", { as: "permissive", for: "update", to: ["public"] }),
	pgPolicy("Allow users to DELETE their own heating bill documents", { as: "permissive", for: "delete", to: ["public"] }),
]);

export const objekte = pgTable("objekte", {
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
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	pgPolicy("Users can access only their own objects", { as: "permissive", for: "all", to: ["public"], using: sql`(auth.uid() = user_id)`, withCheck: sql`(auth.uid() = user_id)` }),
	pgPolicy("Admins can update all, users only their own", { as: "permissive", for: "update", to: ["public"] }),
]);

export const doc_cost_category_defaults = pgTable("doc_cost_category_defaults", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }),
	type: text(),
	name: text(),
	options: text().array(),
	allocation_key: doc_cost_category_allocation_key(),
	document_type: doc_cost_category_document_type(),
	user_id: text(),
}, (table) => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const users = pgTable("users", {
	id: uuid().primaryKey().notNull(),
	email: text().notNull(),
	first_name: text().notNull(),
	last_name: text().notNull(),
	permission: text().default('user').notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
		columns: [table.id],
		foreignColumns: [table.id],
		name: "users_id_fkey"
	}).onDelete("cascade"),
	pgPolicy("Users can insert their own record", { as: "permissive", for: "insert", to: ["public"], withCheck: sql`(auth.uid() = id)` }),
	pgPolicy("Users can read their own data", { as: "permissive", for: "select", to: ["public"] }),
	pgPolicy("Users can update their own data", { as: "permissive", for: "update", to: ["public"] }),
	pgPolicy("User can insert their own row", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("Admins can read all, users only their own", { as: "permissive", for: "select", to: ["public"] }),
	pgPolicy("Admins can update all, users only their own", { as: "permissive", for: "update", to: ["public"] }),
	pgPolicy("Admins can delete all, users only their own", { as: "permissive", for: "delete", to: ["public"] }),
]);
