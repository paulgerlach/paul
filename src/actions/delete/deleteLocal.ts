"use server";

import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import database from "@/db";
import { locals, local_meters } from "@/db/drizzle/schema";
import { ROUTE_OBJEKTE } from "@/routes/routes";
import { getAuthenticatedServerUser } from "@/utils/auth/server";

export async function deleteLocal(localId: string) {
  const user = await getAuthenticatedServerUser();

  if (!user) {
    throw new Error("Nicht authentifiziert");
  }

  const result = await database.transaction(async (tx) => {
    await tx.delete(local_meters).where(eq(local_meters.local_id, localId));
    const deletedLocals = await tx
      .delete(locals)
      .where(and(eq(locals.id, localId)))
      .returning();

    return deletedLocals;
  });

  if (result.length === 0) {
    throw new Error("Einheit nicht gefunden oder keine Berechtigung");
  }

  revalidatePath(`${ROUTE_OBJEKTE}`);

  return { success: true };
}
