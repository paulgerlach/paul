"use server";

import database from "@/db";
import {
    operating_cost_documents,
} from "@/db/drizzle/schema";
import { OperatingCostDocumentType } from "@/types";
import { getAuthenticatedServerUser } from "@/utils/auth/server";
import { eq } from "drizzle-orm";

export async function editBuildingDocument(
    documentID: string,
    updatedDocumentData: Partial<OperatingCostDocumentType>
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
            .update(operating_cost_documents)
            .set(updateData)
            .where(eq(operating_cost_documents.id, documentID))
            .returning();

        if (result.length === 0) {
            throw new Error("Dokument nicht gefunden oder keine Berechtigung zum Bearbeiten");
        }

        return result;
    } catch (err) {
        console.error("DB Update Error", err);
        throw new Error("Fehler beim Aktualisieren des Dokuments");
    }
}
