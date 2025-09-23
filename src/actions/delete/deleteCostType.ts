"use server";

import database from "@/db";
import { doc_cost_category } from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";
import { getAuthenticatedServerUser } from "@/utils/auth/server";

export async function deleteCostType(id: string) {
  const user = await getAuthenticatedServerUser();

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
