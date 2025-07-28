"use server";

import database from "@/db";
import {
  heating_bill_documents
} from "@/db/drizzle/schema";
import type { HeatingBillDocumentType } from "@/types";
import { getAuthenticatedServerUser } from "@/utils/auth/server";
import { eq } from "drizzle-orm";

export async function editHeatingBillDocument(
  documentID: string,
  updatedDocumentData: Partial<HeatingBillDocumentType>
) {
  const user = await getAuthenticatedServerUser();

  if (!user) {
    throw new Error("Nicht authentifiziert");
  }

  const updateData = {
    ...updatedDocumentData,
    start_date: updatedDocumentData.start_date ?? null,
    end_date: updatedDocumentData.end_date ?? null,
  };


  try {
    const result = await database
      .update(heating_bill_documents)
      .set(updateData)
      .where(eq(heating_bill_documents.id, documentID))
      .returning();

    if (result.length === 0) {
      throw new Error("Dokument nicht gefunden oder keine Berechtigung zum Bearbeiten");
    }

    return result;
  } catch (err) {
    console.error("DB Insert Error", err);
    throw new Error("Fehler beim Speichern des Dokuments");
  }

}
