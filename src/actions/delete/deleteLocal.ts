"use server";

import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import database from "@/db";
import { locals } from "@/db/drizzle/schema";
import { ROUTE_OBJEKTE } from "@/routes/routes";
import { getAuthenticatedServerUser } from "@/utils/auth/server";

export async function deleteLocal(localId: string) {
  const user = await getAuthenticatedServerUser();

  if (!user) {
    throw new Error("Nicht authentifiziert");
  }

  const result = await database
    .delete(locals)
    .where(and(eq(locals.id, localId)))
    .returning();

  if (result.length === 0) {
    throw new Error("Einheit nicht gefunden oder keine Berechtigung");
  }

  revalidatePath(`${ROUTE_OBJEKTE}`);

  return { success: true };
}
