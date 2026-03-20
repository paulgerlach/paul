"use server";

import database from "@/db";
import { heating_invoices } from "@/db/drizzle/schema";
import { type AddDocBetriebskostenabrechnungDialogFormValues } from "@/components/Basic/Dialog/AddDocBetriebskostenabrechnungDialog";
import { getAuthenticatedServerUser } from "@/utils/auth/server";
import { eq } from "drizzle-orm";

export async function editHeatingInvoice(
    invoiceID: string,
    formData: AddDocBetriebskostenabrechnungDialogFormValues,
) {
    const user = await getAuthenticatedServerUser();

    if (!user) {
        throw new Error("Nicht authentifiziert");
    }

    const updateData = {
        invoice_date: formData.invoice_date ? formData.invoice_date.toISOString() : null,
        total_amount: formData.total_amount != null ? String(formData.total_amount) : null,
        service_period: formData.service_period,
        for_all_tenants: formData.for_all_tenants,
        purpose: formData.purpose,
        notes: formData.notes,
        direct_local_id: formData.direct_local_id,
    };

    try {
        const result = await database
            .update(heating_invoices)
            .set(updateData)
            .where(eq(heating_invoices.id, invoiceID))
            .returning();

        if (result.length === 0) {
            throw new Error("Rechnung nicht gefunden");
        }

        return result[0];
    } catch (err) {
        console.error("DB Update Error", err);
        throw new Error("Fehler beim Aktualisieren der Rechnung");
    }
}
