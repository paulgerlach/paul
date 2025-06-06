import { relations } from "drizzle-orm/relations";
import { objekte, locals, contracts, contractors } from "./schema";

export const localsRelations = relations(locals, ({one, many}) => ({
	objekte: one(objekte, {
		fields: [locals.objekt_id],
		references: [objekte.id]
	}),
	contracts: many(contracts),
}));

export const objekteRelations = relations(objekte, ({many}) => ({
	locals: many(locals),
}));

export const contractsRelations = relations(contracts, ({one, many}) => ({
	local: one(locals, {
		fields: [contracts.local_id],
		references: [locals.id]
	}),
	contractors: many(contractors),
}));

export const contractorsRelations = relations(contractors, ({one}) => ({
	contract: one(contracts, {
		fields: [contractors.contract_id],
		references: [contracts.id]
	}),
}));