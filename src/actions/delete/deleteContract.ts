"use server";

import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import database from "@/db";
import { locals, contracts } from "@/db/drizzle/schema";
import { ROUTE_OBJEKTE } from "@/routes/routes";
import { getAuthenticatedServerUser } from "@/utils/auth/server";

export async function deleteContract(contractId: string) {
  const user = await getAuthenticatedServerUser();

  if (!user) {
    throw new Error("Nicht authentifiziert");
  }

  const result = await database
    .delete(contracts)
    .where(and(eq(contracts.id, contractId), eq(contracts.user_id, user.id)))
    .returning();

  if (result.length === 0) {
    throw new Error("Mieter nicht gefunden oder keine Berechtigung");
  }

  const localID = result[0].local_id;

  const relatedItem = await database
    .select()
    .from(locals)
    .where(eq(locals.id, localID));

  revalidatePath(`${ROUTE_OBJEKTE}/${relatedItem[0].objekt_id}`);

  return { success: true };
}
