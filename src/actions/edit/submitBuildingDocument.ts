"use server";

import database from "@/db";
import {
    operating_cost_documents,
} from "@/db/drizzle/schema";
import { getAuthenticatedServerUser } from "@/utils/auth/server";
import { eq } from "drizzle-orm";

export async function submitBuildingDocument(
    documentID: string,
) {
    const user = await getAuthenticatedServerUser();

    if (!user) {
        throw new Error("Nicht authentifiziert");
    }

    try {
        const result = await database
            .update(operating_cost_documents)
            .set({ submited: true })
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
