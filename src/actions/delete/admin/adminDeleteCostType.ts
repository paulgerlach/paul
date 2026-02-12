"use server";

import database from "@/db";
import { doc_cost_category } from "@/db/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { getAuthenticatedServerUser } from "@/utils/auth/server";
import { isAdmin, isSuperAdmin } from "@/auth";

export async function adminDeleteCostType(id: string, userId: string) {
  const user = await getAuthenticatedServerUser();

  if (!user) {
    throw new Error("Nicht authentifiziert");
  }

  const isSuperAdminUser = await isSuperAdmin(user.id);
  const isAdminUser = await isAdmin(user.id);
  if (!isSuperAdminUser && !isAdminUser) {
    throw new Error("Nur Administratoren können Kostenarten löschen");
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
