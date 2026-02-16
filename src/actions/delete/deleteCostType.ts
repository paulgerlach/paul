"use server";

import database from "@/db";
import { doc_cost_category } from "@/db/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { getAuthenticatedServerUser } from "@/utils/auth/server";

export async function deleteCostType(id: string) {
  const user = await getAuthenticatedServerUser();

  if (!user) {
    throw new Error("Nicht authentifiziert");
  }

  try {
    const deleted = await database
      .delete(doc_cost_category)
      .where(
        and(
          eq(doc_cost_category.id, id),
          eq(doc_cost_category.user_id, user.id)
        )
      )
      .returning();

    return { success: deleted.length > 0 };
  } catch (error) {
    console.error("Error deleting cost type:", error);
    throw error;
  }
}
