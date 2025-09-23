"use server";

import database from "@/db";
import {
  operating_cost_documents,
} from "@/db/drizzle/schema";
import { ROUTE_BETRIEBSKOSTENABRECHNUNG } from "@/routes/routes";
import { getAuthenticatedServerUser } from "@/utils/auth/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function adminDeleteBuildingDocument(
  docID: string,
  userID: string,
) {
  const user = await getAuthenticatedServerUser();

  if (!user) {
    throw new Error("Nicht authentifiziert");
  }

  const result = await database
    .delete(operating_cost_documents)
    .where(and(eq(operating_cost_documents.id, docID), eq(operating_cost_documents.user_id, userID)))
    .returning();

  if (result.length === 0) {
    throw new Error("Mieter nicht gefunden oder keine Berechtigung");
  }

  revalidatePath(`${ROUTE_BETRIEBSKOSTENABRECHNUNG}/zwischenstand`);

  return { success: true };
}
