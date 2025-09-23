"use server";

import database from "@/db";
import {
  operating_cost_documents,
} from "@/db/drizzle/schema";
import type { OperatingCostDocumentType } from "@/types";
import { getAuthenticatedServerUser } from "@/utils/auth/server";

export async function createBuildingDocuments(
  objectID: string,
  mainDocumentData: OperatingCostDocumentType
) {
  const user = await getAuthenticatedServerUser();

  if (!user) {
    throw new Error("Nicht authentifiziert");
  }

  const insertedDocumentData: OperatingCostDocumentType = {
    ...mainDocumentData,
    user_id: user.id,
    start_date: mainDocumentData.start_date
      ? mainDocumentData.start_date
      : null,
    end_date: mainDocumentData.end_date ? mainDocumentData.end_date : null,
    objekt_id: objectID,
    created_at: new Date().toISOString(),
  };


  try {
    return await database
      .insert(operating_cost_documents)
      .values(insertedDocumentData)
      .returning();
  } catch (err) {
    console.error("DB Insert Error", err);
    throw new Error("Fehler beim Speichern des Dokuments");
  }

}
