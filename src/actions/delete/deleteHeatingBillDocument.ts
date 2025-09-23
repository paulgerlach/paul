"use server";

import database from "@/db";
import {
  heating_bill_documents,
} from "@/db/drizzle/schema";
import { ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";
import { getAuthenticatedServerUser } from "@/utils/auth/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteHeatingBillDocument(
  docID: string,
) {
  const user = await getAuthenticatedServerUser();

  if (!user) {
    throw new Error("Nicht authentifiziert");
  }

  const result = await database
    .delete(heating_bill_documents)
    .where(and(eq(heating_bill_documents.id, docID), eq(heating_bill_documents.user_id, user.id)))
    .returning();

  if (result.length === 0) {
    throw new Error("Mieter nicht gefunden oder keine Berechtigung");
  }

  revalidatePath(`${ROUTE_HEIZKOSTENABRECHNUNG}/zwischenstand`);

  return { success: true };
}
