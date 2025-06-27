"use server";

import { AddCostTypeDialogFormValues } from "@/components/Basic/Dialog/AddBetriebskostenabrechnungCostTypeDialog";
import database from "@/db";
import { doc_cost_category } from "@/db/drizzle/schema";
import type { DocumentCostType } from "@/types";
import { supabaseServer } from "@/utils/supabase/server";
import { eq } from "drizzle-orm";
import type { InferInsertModel } from "drizzle-orm";

export async function updateOrCreateCostType(
  values: AddCostTypeDialogFormValues,
  documentType: DocumentCostType,
  id?: string
) {
  const supabase = await supabaseServer();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(`Supabase Auth Error: ${error.message}`);
  }

  if (!user || !id) {
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
      options: values.options ?? [],
      user_id: user.id,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    if (current.user_id === null) {
      const inserted = await database
        .insert(doc_cost_category)
        .values(baseData)
        .returning();
      return inserted[0];
    } else {
      const updated = await database
        .update(doc_cost_category)
        .set({ ...baseData, created_at: current.created_at })
        .where(eq(doc_cost_category.id, id))
        .returning();
      return updated[0];
    }
  } catch (error) {
    console.error("Error updating/creating cost type:", error);
    throw error;
  }
}
