"use server";

import database from "@/db";
import { doc_cost_category } from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";
import { supabaseServer } from "@/utils/supabase/server";

export async function deleteCostType(id: string) {
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
    await database
      .delete(doc_cost_category)
      .where(eq(doc_cost_category.id, id))
      .returning();

    return { success: true };
  } catch (error) {
    console.error("Error deleting cost type:", error);
    throw error;
  }
}
