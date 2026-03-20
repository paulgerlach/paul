"use client";

import { createHeatingInvoice } from "@/actions/create/createHeatingInvoice";
import { ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";
import { useInvoicesBase } from "@/hooks/useInvoicesBase";
import type {
    DocCostCategoryType,
    InvoiceDocumentType,
} from "@/types";

export function useDokumentenManagementLocal({
    objektId,
    localId,
    docId,
    pathSlug,
    userDocCostCategories,
    relatedInvoices,
}: {
    objektId: string;
    localId: string;
    docId: string;
    pathSlug: string;
    userDocCostCategories: DocCostCategoryType[];
    relatedInvoices?: InvoiceDocumentType[];
}) {
    const isEditMode = !!relatedInvoices;

    const nextLink = isEditMode
        ? `${ROUTE_HEIZKOSTENABRECHNUNG}/localauswahl/weitermachen/${docId}/${pathSlug}/detailansicht`
        : `${ROUTE_HEIZKOSTENABRECHNUNG}/localauswahl/${objektId}/${localId}/${docId}/${pathSlug}/detailansicht`;

    return useInvoicesBase({
        objektId,
        docId,
        userDocCostCategories,
        relatedInvoices,
        saveInvoiceAction: (payload, objId, opDocId, costType) =>
            createHeatingInvoice(payload, objId, opDocId, costType),
        nextLink,
    });
}