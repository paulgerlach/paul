import { relations } from "drizzle-orm/relations";
import {
	locals,
	heating_bill_documents,
	objekte,
	operating_cost_documents,
	contracts,
	contractors,
	local_meters,
	invoice_documents,
	users_in_auth,
	users,
} from "./schema";

export const heating_bill_documentsRelations = relations(
	heating_bill_documents,
	({ one }) => ({
		local: one(locals, {
			fields: [heating_bill_documents.local_id],
			references: [locals.id],
		}),
		objekte: one(objekte, {
			fields: [heating_bill_documents.objekt_id],
			references: [objekte.id],
		}),
	})
);

export const localsRelations = relations(locals, ({ one, many }) => ({
	heating_bill_documents: many(heating_bill_documents),
	objekte: one(objekte, {
		fields: [locals.objekt_id],
		references: [objekte.id],
	}),
	contracts: many(contracts),
	local_meters: many(local_meters),
}));

export const objekteRelations = relations(objekte, ({ many }) => ({
	heating_bill_documents: many(heating_bill_documents),
	operating_cost_documents: many(operating_cost_documents),
	locals: many(locals),
	invoice_documents: many(invoice_documents),
}));

export const operating_cost_documentsRelations = relations(
	operating_cost_documents,
	({ one, many }) => ({
		objekte: one(objekte, {
			fields: [operating_cost_documents.objekt_id],
			references: [objekte.id],
		}),
		invoice_documents: many(invoice_documents),
	})
);

export const contractsRelations = relations(contracts, ({ one, many }) => ({
	local: one(locals, {
		fields: [contracts.local_id],
		references: [locals.id],
	}),
	contractors: many(contractors),
}));

export const contractorsRelations = relations(contractors, ({ one }) => ({
	contract: one(contracts, {
		fields: [contractors.contract_id],
		references: [contracts.id],
	}),
}));

export const local_metersRelations = relations(local_meters, ({ one }) => ({
	local: one(locals, {
		fields: [local_meters.local_id],
		references: [locals.id],
	}),
}));

export const invoice_documentsRelations = relations(
	invoice_documents,
	({ one }) => ({
		objekte: one(objekte, {
			fields: [invoice_documents.objekt_id],
			references: [objekte.id],
		}),
		operating_cost_document: one(operating_cost_documents, {
			fields: [invoice_documents.operating_doc_id],
			references: [operating_cost_documents.id],
		}),
	})
);

export const usersRelations = relations(users, ({ one }) => ({
	users_in_auth: one(users_in_auth, {
		fields: [users.id],
		references: [users_in_auth.id],
	}),
}));

export const users_in_authRelations = relations(users_in_auth, ({ many }) => ({
	users: many(users),
}));
