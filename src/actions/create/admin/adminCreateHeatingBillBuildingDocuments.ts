"use server";

import database from "@/db";
import {
  heating_bill_documents
} from "@/db/drizzle/schema";
import type { HeatingBillDocumentType } from "@/types";
import { getAuthenticatedServerUser } from "@/utils/auth/server";

export async function adminCreateHeatingBillBuildingDocuments(
  objectID: string,
  userID: string,
  mainDocumentData: HeatingBillDocumentType
) {
  const user = await getAuthenticatedServerUser();

  if (!user) {
    throw new Error("Nicht authentifiziert");
  }

  const insertedDocumentData: HeatingBillDocumentType = {
    ...mainDocumentData,
    user_id: userID,
    start_date: mainDocumentData.start_date
      ? mainDocumentData.start_date
      : null,
    end_date: mainDocumentData.end_date ? mainDocumentData.end_date : null,
    objekt_id: objectID,
    local_id: null,
    consumption_dependent: mainDocumentData.consumption_dependent,
    living_space_share: mainDocumentData.living_space_share,
    created_at: new Date().toISOString(),
  };


  try {
    return await database
      .insert(heating_bill_documents)
      .values(insertedDocumentData)
      .returning();
  } catch (err) {
    console.error("DB Insert Error", err);
    throw new Error("Fehler beim Speichern des Dokuments");
  }

}
