"use client";

import { adminCreateHeatingInvoiceDocument } from "@/actions/create/admin/adminCreateHeatingInvoiceDocument";
import { ROUTE_HEIZKOSTENABRECHNUNG, ROUTE_ADMIN } from "@/routes/routes";
import { useInvoicesBase } from "@/hooks/useInvoicesBase";
import type {
	DocCostCategoryType,
	InvoiceDocumentType,
	LocalType,
} from "@/types";

export function useAdminDokumentenManagement({
	objektId,
	docId,
	pathSlug,
	userId,
	userDocCostCategories,
	relatedInvoices,
	locals,
}: {
	objektId: string;
	docId: string;
	pathSlug: string;
	userId: string;
	userDocCostCategories: DocCostCategoryType[];
	relatedInvoices?: InvoiceDocumentType[];
	locals: LocalType[];
}) {
	const isEditMode = !!relatedInvoices;

	const nextLink = isEditMode
		? `${ROUTE_ADMIN}/${userId}${ROUTE_HEIZKOSTENABRECHNUNG}/objektauswahl/weitermachen/${docId}/${pathSlug}/gesamtkosten`
		: `${ROUTE_ADMIN}/${userId}${ROUTE_HEIZKOSTENABRECHNUNG}/objektauswahl/${objektId}/${docId}/${pathSlug}/gesamtkosten`;

	return useInvoicesBase({
		objektId,
		docId,
		pathSlug,
		userDocCostCategories,
		relatedInvoices,
		userId,
		saveInvoiceAction: (payload, objId, opDocId, costType, uId) =>
			adminCreateHeatingInvoiceDocument(
				payload,
				objId,
				uId!,
				opDocId,
				costType,
			),
		nextLink,
		locals,
	});
}
