"use server";

import database from "@/db";
import { doc_cost_category } from "@/db/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { getAuthenticatedServerUser } from "@/utils/auth/server";

export async function adminDeleteCostType(id: string, userId: string) {
  const user = await getAuthenticatedServerUser();

  if (!user) {
    throw new Error("Nicht authentifiziert");
  }

  const deleted = await database
    .delete(doc_cost_category)
    .where(
      and(
        eq(doc_cost_category.id, id),
        eq(doc_cost_category.user_id, userId)
      )
    )
    .returning();

  return { success: deleted.length > 0 };
}
