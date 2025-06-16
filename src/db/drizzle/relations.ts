import { relations } from "drizzle-orm/relations";
import { objekte, locals, contracts, contractors, heating_bill_documents } from "./schema";

export const localsRelations = relations(locals, ({one, many}) => ({
	objekte: one(objekte, {
		fields: [locals.objekt_id],
		references: [objekte.id]
	}),
	contracts: many(contracts),
	heating_bill_documents: many(heating_bill_documents),
}));

export const objekteRelations = relations(objekte, ({many}) => ({
	locals: many(locals),
	heating_bill_documents: many(heating_bill_documents),
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

export const heating_bill_documentsRelations = relations(heating_bill_documents, ({one}) => ({
	local: one(locals, {
		fields: [heating_bill_documents.local_id],
		references: [locals.id]
	}),
	objekte: one(objekte, {
		fields: [heating_bill_documents.objekt_id],
		references: [objekte.id]
	}),
}));