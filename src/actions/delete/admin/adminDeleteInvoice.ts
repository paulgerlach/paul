"use server";

import database from "@/db";
import {
  documents,
  heating_invoices,
} from "@/db/drizzle/schema";
import { getAuthenticatedServerUser } from "@/utils/auth/server";
import { and, eq } from "drizzle-orm";
import { sanitizeFileName } from "@/utils/file";
import { supabaseServer } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function adminDeleteInvoice(
  docID: string,
  userID: string,
  path: string,
) {
  const user = await getAuthenticatedServerUser();

  if (!user) {
    throw new Error("Nicht authentifiziert");
  }

  const [invoice] = await database
    .select()
    .from(heating_invoices)
    .where(and(eq(heating_invoices.id, docID), eq(heating_invoices.user_id, userID)))
    .limit(1);

  if (!invoice) {
    throw new Error("Rechnung nicht gefunden");
  }

  if (invoice.document_name && invoice.heating_doc_id && invoice.user_id) {
    const supabase = await supabaseServer();
    const sanitizedFileName = sanitizeFileName(invoice.document_name);
    const fullFileName = `${invoice.heating_doc_id}_${sanitizedFileName}`;
    const storagePath = `${invoice.user_id}/${fullFileName}`;

    await supabase.storage.from("documents").remove([storagePath]);

    await database
      .delete(documents)
      .where(
        and(
          eq(documents.related_id, invoice.heating_doc_id),
          eq(documents.document_name, invoice.document_name),
          eq(documents.user_id, invoice.user_id)
        )
      );
  }

  await database
    .delete(heating_invoices)
    .where(and(eq(heating_invoices.id, docID), eq(heating_invoices.user_id, userID)))
    .returning();

  revalidatePath(path);

  return { success: true };
}
