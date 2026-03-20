"use client";

import { adminCreateHeatingInvoiceDocument } from "@/actions/create/admin/adminCreateHeatingInvoiceDocument";
import { ROUTE_ADMIN, ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";
import { useInvoicesBase } from "@/hooks/useInvoicesBase";
import type {
    DocCostCategoryType,
    InvoiceDocumentType,
} from "@/types";

export function useAdminDokumentenManagementLocal({
    objektId,
    localId,
    docId,
    userId,
    pathSlug,
    userDocCostCategories,
    relatedInvoices,
}: {
    objektId: string;
    localId: string;
    docId: string;
    userId: string;
    pathSlug: string;
    userDocCostCategories: DocCostCategoryType[];
    relatedInvoices?: InvoiceDocumentType[];
}) {
    const isEditMode = !!relatedInvoices;

    const nextLink = isEditMode
        ? `${ROUTE_ADMIN}/${userId}${ROUTE_HEIZKOSTENABRECHNUNG}/localauswahl/weitermachen/${docId}/${pathSlug}/detailansicht`
        : `${ROUTE_ADMIN}/${userId}${ROUTE_HEIZKOSTENABRECHNUNG}/localauswahl/${objektId}/${localId}/${docId}/${pathSlug}/detailansicht`;

    return useInvoicesBase({
        objektId,
        docId,
        userDocCostCategories,
        relatedInvoices,
        userId,
        saveInvoiceAction: (payload, objId, opDocId, costType, uId) =>
            adminCreateHeatingInvoiceDocument(payload, objId, uId!, opDocId, costType),
        nextLink,
    });
}