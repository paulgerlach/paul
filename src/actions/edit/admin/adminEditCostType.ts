"use server";

import { AddCostTypeDialogFormValues } from "@/components/Basic/Dialog/AddBetriebskostenabrechnungCostTypeDialog";
import database from "@/db";
import { doc_cost_category } from "@/db/drizzle/schema";
import type { DocumentCostType } from "@/types";
import { getAuthenticatedServerUser } from "@/utils/auth/server";
import { eq } from "drizzle-orm";
import type { InferInsertModel } from "drizzle-orm";

export async function adminEditCostType(
  values: AddCostTypeDialogFormValues,
  documentType: DocumentCostType,
  id: string,
  userID: string
) {
  const user = await getAuthenticatedServerUser();

  if (!user) {
    throw new Error("Nicht authentifiziert");
  }

  try {
    const existing = await database
      .select()
      .from(doc_cost_category)
      .where(eq(doc_cost_category.id, id));

    if (!existing.length) {
      throw new Error("Kostenart nicht gefunden");
    }

    const current = existing[0];

    const baseData: InferInsertModel<typeof doc_cost_category> = {
      type: values.type ?? "",
      name: values.name ?? "",
      allocation_key: values.allocation_key,
      document_type: documentType,
      user_id: userID,
      updated_at: new Date().toISOString(),
      created_at: current.created_at,
    };

    const updated = await database
      .update(doc_cost_category)
      .set(baseData)
      .where(eq(doc_cost_category.id, id))
      .returning();

    return updated[0];
  } catch (error) {
    console.error("Error updating cost type:", error);
    throw error;
  }
}
