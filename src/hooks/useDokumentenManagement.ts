"use client";

import { createHeatingInvoice } from "@/actions/create/createHeatingInvoice";
import { ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";
import { useInvoicesBase } from "@/hooks/useInvoicesBase";
import type {
	DocCostCategoryType,
	InvoiceDocumentType,
	LocalType,
} from "@/types";

export function useDokumentenManagement({
	objektId,
	docId,
	pathSlug,
	userDocCostCategories,
	relatedInvoices,
	locals,
}: {
	objektId: string;
	docId: string;
	pathSlug: string;
	userDocCostCategories: DocCostCategoryType[];
	relatedInvoices?: InvoiceDocumentType[];
	locals: LocalType[];
}) {
	const isEditMode = !!relatedInvoices;

	const nextLink = isEditMode
		? `${ROUTE_HEIZKOSTENABRECHNUNG}/objektauswahl/weitermachen/${docId}/${pathSlug}/gesamtkosten`
		: `${ROUTE_HEIZKOSTENABRECHNUNG}/objektauswahl/${objektId}/${docId}/${pathSlug}/gesamtkosten`;

	return useInvoicesBase({
		objektId,
		docId,
		userDocCostCategories,
		relatedInvoices,
		saveInvoiceAction: (payload, objId, opDocId, costType) =>
			createHeatingInvoice(payload, objId, opDocId, costType),
		nextLink,
		locals,
	});
}
