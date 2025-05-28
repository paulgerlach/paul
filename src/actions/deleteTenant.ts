"use server";

import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import database from "@/db";
import { locals, tenants } from "@/db/drizzle/schema";
import { supabaseServer } from "@/utils/supabase/server";
import { ROUTE_OBJEKTE } from "@/routes/routes";

export async function deleteTenant(tenantId: string) {
  const supabase = await supabaseServer();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    console.error("Auth error:", error);
    throw new Error("Nicht authentifiziert");
  }

  const result = await database
    .delete(tenants)
    .where(and(eq(tenants.id, tenantId), eq(tenants.user_id, user.id)))
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
