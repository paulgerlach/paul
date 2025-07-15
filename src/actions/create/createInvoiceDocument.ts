"use server";

import { invoice_documents } from "@/db/drizzle/schema";
import database from "@/db";
import { supabaseServer } from "@/utils/supabase/server";
import { type AddDocBetriebskostenabrechnungDialogFormValues } from "@/components/Basic/Dialog/AddDocBetriebskostenabrechnungDialog";
import type { InvoiceDocumentType } from "@/types";

export async function createInvoiceDocument(
    formData: AddDocBetriebskostenabrechnungDialogFormValues,
    objectID?: string,
    operatingDocID?: string | null,
    costType?: string | null
) {
    const supabase = await supabaseServer();

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error) {
        throw new Error(`Supabase Auth Error: ${error.message}`);
    }

    if (!user) {
        throw new Error("Nicht authentifiziert");
    }

    const now = new Date().toISOString();

    const insertData: InvoiceDocumentType = {
        user_id: user.id,
        document_name: formData?.document?.[0]?.name ?? null,
        objekt_id: objectID,
        cost_type: costType ?? null,
        invoice_date: formData.invoice_date ? formData.invoice_date.toISOString() : null,
        total_amount: formData.total_amount ? String(formData.total_amount) : null,
        service_period: formData.service_period ?? null,
        for_all_tenants: formData.for_all_tenants ?? null,
        purpose: formData.purpose ?? null,
        notes: formData.notes ?? null,
        operating_doc_id: operatingDocID ?? null,
        direct_local_id: formData.direct_local_id ?? null,
        created_at: now,
    };

    const [insertedInvoice] = await database
        .insert(invoice_documents)
        .values(insertData)
        .returning();

    return insertedInvoice;
}
