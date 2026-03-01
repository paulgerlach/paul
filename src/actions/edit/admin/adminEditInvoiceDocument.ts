"use server";

import { heating_invoices } from "@/db/drizzle/schema";
import database from "@/db";
import { type AddDocBetriebskostenabrechnungDialogFormValues } from "@/components/Basic/Dialog/AddDocBetriebskostenabrechnungDialog";
import { getAuthenticatedServerUser } from "@/utils/auth/server";
import { eq } from "drizzle-orm";

export async function adminEditInvoiceDocument(
    invoiceID: string,
    formData: AddDocBetriebskostenabrechnungDialogFormValues,
) {
    const user = await getAuthenticatedServerUser();

    if (!user) {
        throw new Error("Nicht authentifiziert");
    }

    const updateData = {
        document_name: formData?.document?.[0]?.name ?? null,
        invoice_date: formData.invoice_date ? formData.invoice_date.toISOString() : null,
        total_amount: formData.total_amount ? String(formData.total_amount) : null,
        service_period: formData.service_period ?? null,
        for_all_tenants: formData.for_all_tenants ?? null,
        purpose: formData.purpose ?? null,
        notes: formData.notes ?? null,
        direct_local_id: formData.direct_local_id ?? null,
    };

    const [updatedInvoice] = await database
        .update(heating_invoices)
        .set(updateData)
        .where(eq(heating_invoices.id, invoiceID))
        .returning();

    return updatedInvoice;
}
