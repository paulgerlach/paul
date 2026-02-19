import { pgTable, foreignKey, pgPolicy, uuid, timestamp, boolean, numeric, text, jsonb, date, unique, varchar, integer, pgEnum, index, primaryKey } from "drizzle-orm/pg-core"
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
	submited: boolean().default(false).notNull(),
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
	pgPolicy("Users can view their own heating bill documents.", { as: "permissive", for: "select", to: ["public"], using: sql`(auth.uid() = user_id)` }),
	pgPolicy("Users can insert their own heating bill documents.", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("Users can update their own heating bill documents.", { as: "permissive", for: "update", to: ["public"] }),
	pgPolicy("Users can delete their own heating bill documents.", { as: "permissive", for: "delete", to: ["public"] }),
	pgPolicy("Admins can all, users only their own", { as: "permissive", for: "all", to: ["public"] }),
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
	pgPolicy("Admins can all, users only their own", { as: "permissive", for: "all", to: ["public"] }),
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
	pgPolicy("Users can view their own documents", { as: "permissive", for: "select", to: ["public"], using: sql`(user_id = auth.uid())` }),
	pgPolicy("Users can insert documents with their own user_id", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("Users can update their own documents", { as: "permissive", for: "update", to: ["public"] }),
	pgPolicy("Users can delete their own documents", { as: "permissive", for: "delete", to: ["public"] }),
	pgPolicy("Admins can all, users only their own", { as: "permissive", for: "all", to: ["public"] }),
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
	pgPolicy("Admins can all, users only their own", { as: "permissive", for: "all", to: ["public"] }),
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
	meter_ids: text().array(),
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
	pgPolicy("Admins can access locals", { as: "permissive", for: "all", to: ["public"] }),
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
	pgPolicy("Update policy: Admins can all, users only their own", { as: "permissive", for: "all", to: ["public"] }),
]);

export const local_meters = pgTable("local_meters", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	meter_number: text(),
	meter_note: text(),
	meter_type: text(),
	local_id: uuid().defaultRandom(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
		columns: [table.local_id],
		foreignColumns: [locals.id],
		name: "local_meters_local_id_fkey"
	}),
	pgPolicy("Only admin can edit this data", { as: "permissive", for: "all", to: ["public"], using: sql`is_admin()`, withCheck: sql`is_admin()` }),
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
	pgPolicy("Allow users to SELECT their own heating bill documents", { as: "permissive", for: "select", to: ["public"], using: sql`(user_id = auth.uid())` }),
	pgPolicy("Allow users to INSERT their own heating bill documents", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("Allow users to UPDATE their own heating bill documents", { as: "permissive", for: "update", to: ["public"] }),
	pgPolicy("Allow users to DELETE their own heating bill documents", { as: "permissive", for: "delete", to: ["public"], using: sql`(user_id = auth.uid())` }),
	pgPolicy("Admins can all, users only their own", { as: "permissive", for: "all", to: ["public"] }),
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
	image_url: text(),
	agency_id: uuid(),

}, (table) => [
	foreignKey({
		columns: [table.agency_id],
		foreignColumns: [agencies.id],
		name: "agency_id_fkey"
	}).onDelete("set null"),

	pgPolicy("Users and Admins can access objects", { as: "permissive", for: "all", to: ["public"], using: sql`((user_id = auth.uid()) OR is_admin())`, withCheck: sql`((user_id = auth.uid()) OR is_admin())` }),
	pgPolicy("Admins can update all, users only their own", { as: "permissive", for: "update", to: ["public"] }),
	pgPolicy("Users and Admins can insert objects", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("Users and Admins can delete objects", { as: "permissive", for: "delete", to: ["public"] }),
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



export const agencies = pgTable('agencies', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	isActive: boolean('is_active').notNull().default(true),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
	pgPolicy('super_admins_full_access', {
		as: 'permissive',
		for: 'all',
		to: ["authenticated"],
		using: sql`auth.role() = 'super_admin'`,
	}),
	pgPolicy('', {
		as: 'permissive',
		for: 'select',
		to: 'authenticated',
		using: sql`auth.role() = 'admin'`,
	}),
	pgPolicy('', {
		as: 'permissive',
		for: 'update',
		to: 'authenticated',
		using: sql`auth.role() = 'admin'`,
	}),
]);

export const users = pgTable("users", {
	id: uuid().primaryKey().notNull(),
	email: text().notNull(),
	first_name: text().notNull(),
	last_name: text().notNull(),
	permission: text().default('user').notNull(),
	has_seen_tour: boolean().default(false).notNull(),
	agency_id: uuid(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
		columns: [table.id],
		foreignColumns: [table.id],
		name: "users_id_fkey"
	}).onDelete("cascade"),
	foreignKey({
		columns: [table.agency_id],
		foreignColumns: [agencies.id],
		name: "agency_id_fkey"
	}).onDelete("set null"),
	pgPolicy("Users can insert their own record", { as: "permissive", for: "insert", to: ["public"], withCheck: sql`(auth.uid() = id)` }),
	pgPolicy("Users can read their own data", { as: "permissive", for: "select", to: ["public"] }),
	pgPolicy("Users can update their own data", { as: "permissive", for: "update", to: ["public"] }),
	pgPolicy("User can insert their own row", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("Admins can read all, users only their own", { as: "permissive", for: "select", to: ["public"] }),
	pgPolicy("Admins can update all, users only their own", { as: "permissive", for: "update", to: ["public"] }),
	pgPolicy("Admins can delete all, users only their own", { as: "permissive", for: "delete", to: ["public"] }),
]);

export const heating_invoices = pgTable("heating_invoices", {
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
	heating_doc_id: uuid(),
	direct_local_id: uuid().array(),
}, (table) => [
	foreignKey({
		columns: [table.heating_doc_id],
		foreignColumns: [heating_bill_documents.id],
		name: "heating_invoices_heating_doc_id_fkey"
	}),
	foreignKey({
		columns: [table.objekt_id],
		foreignColumns: [objekte.id],
		name: "heating_invoices_objekt_id_fkey"
	}),
	pgPolicy("Admins can all, users only their own", { as: "permissive", for: "all", to: ["public"], using: sql`((user_id = auth.uid()) OR is_admin())`, withCheck: sql`((user_id = auth.uid()) OR is_admin())` }),
	pgPolicy("Allow users to ALL their own heating bill documents", { as: "permissive", for: "all", to: ["public"] }),
]);

export const system_settings = pgTable("system_settings", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	registration_enabled: boolean().default(true).notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow(),
	updated_by: uuid(),
}, (table) => [
	pgPolicy("Admins can view system settings", { as: "permissive", for: "select", to: ["public"], using: sql`is_admin()` }),
	pgPolicy("Admins can update system settings", { as: "permissive", for: "update", to: ["public"], using: sql`is_admin()`, withCheck: sql`is_admin()` }),
	pgPolicy("Anyone can view registration status", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const bved_api_tokens = pgTable("bved_api_tokens", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	user_id: uuid().notNull(),
	client_name: text().notNull(),
	access_token_prefix: varchar({ length: 20 }).notNull(), // First 8 chars for lookup
	access_token_hash: text().notNull(), // HMAC-SHA256 hash of full token
	refresh_token_prefix: varchar({ length: 20 }).notNull(), // First 8 chars for lookup
	refresh_token_hash: text().notNull(), // HMAC-SHA256 hash of full token
	access_token_expires_at: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	refresh_token_expires_at: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	last_used_at: timestamp({ withTimezone: true, mode: 'string' }),
	revoked: boolean().default(false).notNull(),
	metadata: jsonb(),
}, (table) => [
	foreignKey({
		columns: [table.user_id],
		foreignColumns: [users.id],
		name: "bved_api_tokens_user_id_fkey"
	}).onDelete("cascade"),
	index("bved_api_tokens_access_token_prefix_idx").on(table.access_token_prefix),
	pgPolicy("Users can access their own tokens or admins can access all", {
		as: "permissive",
		for: "all",
		to: ["public"],
		using: sql`(user_id = auth.uid() OR is_admin())`,
		withCheck: sql`(user_id = auth.uid() OR is_admin())`
	}),
	// Note: Token validation in requireExternalAuth() uses service role connection
	// which bypasses RLS. No policy needed for service role access.
]);

export const bved_platform_credentials = pgTable("bved_platform_credentials", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	platform_type: text().notNull(), // e.g., "kalo", "other_bved_provider"
	property_id: uuid().notNull(), // Reference to objekte.id
	credentials: jsonb().notNull(), // Encrypted credentials (client_id, client_secret, etc.) - See migration comments for encryption method
	token_expires_at: timestamp({ withTimezone: true, mode: 'string' }), // When the stored token expires
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
		columns: [table.property_id],
		foreignColumns: [objekte.id],
		name: "bved_platform_credentials_property_id_fkey"
	}).onDelete("cascade"),
	pgPolicy("Users can access credentials for their properties", {
		as: "permissive",
		for: "all",
		to: ["public"],
		using: sql`(EXISTS (SELECT 1 FROM objekte WHERE objekte.id = property_id AND objekte.user_id = auth.uid()))`,
		withCheck: sql`(EXISTS (SELECT 1 FROM objekte WHERE objekte.id = property_id AND objekte.user_id = auth.uid()))`
	}),
	pgPolicy("Admins can manage all credentials", {
		as: "permissive",
		for: "all",
		to: ["public"],
		using: sql`is_admin()`,
		withCheck: sql`is_admin()`
	}),
]);

export const bved_cost_categories_cache = pgTable("bved_cost_categories_cache", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	property_id: uuid().notNull(), // Reference to objekte.id
	cache_key: text().notNull(), // Unique key for cache lookup (e.g., property_id + period)
	cached_data: jsonb().notNull(), // Cached cost category data
	expires_at: timestamp({ withTimezone: true, mode: 'string' }).notNull(), // 24hr TTL from created_at
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
		columns: [table.property_id],
		foreignColumns: [objekte.id],
		name: "bved_cost_categories_cache_property_id_fkey"
	}).onDelete("cascade"),
	unique("bved_cost_categories_cache_cache_key_key").on(table.cache_key),
	pgPolicy("Users can access cache for their properties", {
		as: "permissive",
		for: "all",
		to: ["public"],
		using: sql`(EXISTS (SELECT 1 FROM objekte WHERE objekte.id = property_id AND objekte.user_id = auth.uid()))`,
		withCheck: sql`(EXISTS (SELECT 1 FROM objekte WHERE objekte.id = property_id AND objekte.user_id = auth.uid()))`
	}),
	pgPolicy("Admins can manage all cache", {
		as: "permissive",
		for: "all",
		to: ["public"],
		using: sql`is_admin()`,
		withCheck: sql`is_admin()`
	}),
]);

export const leads = pgTable("leads", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: text().notNull(),
	source: text(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	pgPolicy("Enable insert for anonymous users", {
		as: "permissive",
		for: "insert",
		to: ["anon", "public"],
		using: sql`true`
	}),
	pgPolicy("Enable read for admin users only", {
		as: "restrictive",
		for: "select",
		to: ["authenticated"],
		using: sql`auth.role() = 'admin'`
	}),
])

export const gateway_desired_states = pgTable("gateway_desired_states", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	gateway_eui: text().notNull().references(() => gateway_devices.eui),  // Unique identifier for the gateway (e.g., from MQTT topic)
	desired_app_version: text(),  // Desired application firmware version
	desired_boot_version: text(),  // Desired bootloader firmware version  
	desired_etag: text(),  // Desired config ETag/hash
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	pgPolicy("Admins can manage gateway states", { as: "permissive", for: "all", to: ["service_role"] }),
]);

// Config versions (stores actual config content)
export const config_versions = pgTable("config_versions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	etag: text().notNull().unique(), // Hash of config content
	config: jsonb().notNull(), // The actual configuration
	description: text(),
	created_by: text(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	is_active: boolean().default(true),
}, (table) => [
	pgPolicy("Admins can manage config versions", { as: "permissive", for: "all", to: ["service_role"] }),
]);

// Firmware versions
export const firmware_versions = pgTable("firmware_versions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	filename: text().notNull().unique(),
	original_filename: text().notNull(),
	version: text().notNull(),
	type: text().notNull(), // 'boot', 'modem', 'application'
	device_model: text().notNull(),
	size_bytes: integer().notNull(),
	checksum_sha256: text().notNull(),
	total_chunks: integer().notNull(),
	chunk_size: integer().default(512),
	description: text(),
	release_notes: text(),
	min_version: text(),
	max_version: text(),
	deployment_type: text().default('scheduled'), // 'scheduled', 'available', 'force'
	allowed_gateways: jsonb().default('[]'),
	is_active: boolean().default(true),
	uploaded_by: text(),
	uploaded_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	pgPolicy("Admins can manage firmware", { as: "permissive", for: "all", to: ["service_role"] }),
]);

// Firmware deployments
export const firmware_deployments = pgTable("firmware_deployments", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	gateway_eui: text().notNull().references(() => gateway_devices.eui),
	firmware_id: uuid().references(() => firmware_versions.id),
	scheduled_at: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	started_at: timestamp({ withTimezone: true, mode: 'string' }),
	completed_at: timestamp({ withTimezone: true, mode: 'string' }),
	status: text().default('scheduled'), // 'scheduled', 'downloading', 'flashing', 'completed', 'failed', 'cancelled', 'retrying'
	current_chunk: integer().default(0),
	total_chunks: integer(),
	error_message: text(),
	retry_count: integer().default(0),
	last_chunk_at: timestamp({ withTimezone: true, mode: 'string' }),
	metadata: jsonb().default({}),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	pgPolicy("Admins can manage deployments", { as: "permissive", for: "all", to: ["service_role"] }),
]);

// Gateway config overrides
export const gateway_config_overrides = pgTable("gateway_config_overrides", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	gateway_eui: text().notNull().references(() => gateway_devices.eui),
	config_key: text().notNull(),
	config_value: text(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	pgPolicy("Admins can manage overrides", { as: "permissive", for: "all", to: ["service_role"] }),
]);

// Firmware download log
export const firmware_download_log = pgTable("firmware_download_log", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	gateway_eui: text().notNull().references(() => gateway_devices.eui),
	firmware_filename: text().notNull(),
	chunk_number: integer().notNull(),
	success: boolean().notNull(),
	error_message: text(),
	response_time_ms: integer(),
	downloaded_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	pgPolicy("Admins can view all logs", { as: "permissive", for: "select", to: ["service_role"] }),
]);

// Gateway status
export const gateway_status = pgTable("gateway_status", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	gateway_eui: text().notNull().references(() => gateway_devices.eui),
	timestamp: timestamp({ withTimezone: true, mode: 'string' }).defaultNow(),
	// Status fields from documentation page 11-12
	time: integer(),  // Unix timestamp
	sync_to: integer(),
	sync_from: integer(),
	sync_ticks: integer(),
	monitor: text(),
	ci: text(),  // Cell ID
	tac: text(),  // Tracking Area Code
	rsrp: integer(),  // Received Signal Strength Indicator
	rsrq: integer(),  // Reference Signal Received Quality
	snr: integer(),  // Signal to Noise Ratio
	operator: text(),  // Mobile Network Code
	band: integer(),
	apn: text(),
	vbat: integer(),  // Battery voltage in mV
	temperature: integer(),  // Temperature in 0.1°C
	collected: boolean(),
	telegram_count: integer(),
	uploading_count: integer(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	pgPolicy("Admins can manage devices", { as: "permissive", for: "all", to: ["service_role"] }),
]);

// Gateway devices (from device uplink)
export const gateway_devices = pgTable("gateway_devices", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	eui: text().notNull().unique(),
	imei: text(),
	imsi: text(),
	iccid: text(),
	model: text(),
	firmware: text(),
	boot_version: text(),
	last_seen: timestamp({ withTimezone: true, mode: 'string' }),
	metadata: jsonb().default({}),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	pgPolicy("Admins can manage devices", { as: "permissive", for: "all", to: ["service_role"] }),
]);

export const wmbus_telegrams = pgTable("wmbus_telegrams", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	gateway_eui: text().notNull().references(() => gateway_devices.eui),
	timestamp: integer().notNull(),  // Unix timestamp
	telegram_hex: text().notNull(),  // Binary data as hex string
	rssi: integer(),  // Received Signal Strength Indicator in dBm
	mode: text(),  // 'C', 'T', 'S', 'X', 'U' as per documentation
	type: text(),  // 'A', 'B', 'X', 'U' as per documentation
	meter_number: text(),  // Extracted from telegram
	manufacturer_code: text(),
	version: text(),
	device_type: text(),
	processed: boolean().default(false),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	pgPolicy("Admins can manage devices", { as: "permissive", for: "all", to: ["service_role"] }),
]);

// Firmware history
export const firmware_history = pgTable("firmware_history", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	gateway_eui: text().notNull().references(() => gateway_devices.eui),
	firmware_type: text().notNull(), // 'app', 'boot', 'modem'
	version: text().notNull(),
	details: jsonb().default({}),
	first_seen: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	last_seen: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	pgPolicy("Admins can view all history", { as: "permissive", for: "select", to: ["service_role"] }),
]);

// Severity enum
export const severityEnum = pgEnum('alert_severity', ['info', 'warning', 'error', 'critical']);

export const gatewayAlerts = pgTable('gateway_alerts', {
	id: uuid('id').defaultRandom().primaryKey(),
	gatewayEui: varchar('gateway_eui', { length: 17 }).notNull(),
	alertType: varchar('alert_type', { length: 50 }).notNull(),
	severity: severityEnum('severity').notNull(),
	message: text('message').notNull(),
	data: jsonb('data'),
	createdAt: timestamp('created_at', { mode: 'string', withTimezone: true }).defaultNow().notNull(),
	resolvedAt: timestamp('resolved_at', { mode: 'string', withTimezone: true }),
	updatedAt: timestamp('updated_at', { mode: 'string', withTimezone: true }).defaultNow().notNull(),
}, (table) => [
	pgPolicy("Admins can view all history", { as: "permissive", for: "select", to: ["service_role"] }),
]);
