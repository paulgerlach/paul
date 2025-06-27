"use server";

import { AddCostTypeDialogFormValues } from "@/components/Basic/Dialog/AddBetriebskostenabrechnungCostTypeDialog";
import database from "@/db";
import { doc_cost_category } from "@/db/drizzle/schema";
import type { DocumentCostType } from "@/types";
import { supabaseServer } from "@/utils/supabase/server";
import { type InferInsertModel } from "drizzle-orm";

export async function createCostType(
  values: AddCostTypeDialogFormValues,
  documentType: DocumentCostType
) {
  const supabase = await supabaseServer();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(`Supabase Auth Error: ${error.message}`);
  }

  if (!user) {
    throw new Error("Nicht authentifiziert");
  }

  try {
    const insertData: InferInsertModel<typeof doc_cost_category> = {
      type: values.type ?? "",
      name: values.name ?? "",
      allocation_key: values.allocation_key,
      document_type: documentType,
      options: values.options ?? [],
      user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const inserted = await database
      .insert(doc_cost_category)
      .values(insertData)
      .returning();

    return inserted[0];
  } catch (error) {
    console.error("Error inserting cost type:", error);
    throw error;
  }
}
