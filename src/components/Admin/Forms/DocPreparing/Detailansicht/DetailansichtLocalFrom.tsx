"use client";

import { editHeatingInvoice } from "@/actions/edit/editHeatingInvoice";
import { ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";
import { InvoiceDocumentType, LocalType } from "@/types";
import DetailansichtBase from "./shared/DetailansichtBase";

interface DetailansichtLocalFromProps {
    objektId: string;
    docId: string;
    pathSlug: string;
    relatedInvoices?: InvoiceDocumentType[];
    locals: LocalType[];
    localId?: string;
}

export default function DetailansichtLocalFrom({
    objektId,
    docId,
    pathSlug,
    relatedInvoices,
    locals,
    localId
}: DetailansichtLocalFromProps) {
    const isEditMode = !!relatedInvoices;

    const backLink = isEditMode
        ? `${ROUTE_HEIZKOSTENABRECHNUNG}/localauswahl/weitermachen/${docId}/${pathSlug === "manuell" ? "abrechnungszeitraum" : `${pathSlug}/dokumentenmanagement`}`
        : `${ROUTE_HEIZKOSTENABRECHNUNG}/localauswahl/${objektId}/${localId}/${docId}/${pathSlug === "manuell" ? "abrechnungszeitraum" : `${pathSlug}/dokumentenmanagement`}`;

    const nextLink = isEditMode
        ? `${ROUTE_HEIZKOSTENABRECHNUNG}/localauswahl/weitermachen/${docId}/${pathSlug}/gesamtkosten`
        : `${ROUTE_HEIZKOSTENABRECHNUNG}/localauswahl/${objektId}/${localId}/${docId}/${pathSlug}/gesamtkosten`;

    const handleSave = async (item: any) => {
        const formData = {
            invoice_date: item.invoice_date ? new Date(item.invoice_date) : null,
            total_amount: item.total_amount ? Number(item.total_amount) : null,
            service_period: item.service_period ?? null,
            for_all_tenants: item.for_all_tenants ?? null,
            purpose: item.purpose ?? null,
            notes: item.notes ?? null,
            direct_local_id: item.direct_local_id ?? null,
            document: [],
        };
        await editHeatingInvoice(item.id, formData as any);
    };

    return (
        <DetailansichtBase
            relatedInvoices={relatedInvoices}
            locals={locals}
            backLink={backLink}
            nextLink={nextLink}
            onSave={handleSave}
        />
    );
}
