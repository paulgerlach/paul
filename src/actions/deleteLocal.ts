"use server";

import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import database from "@/db";
import { locals } from "@/db/drizzle/schema";
import { supabaseServer } from "@/utils/supabase/server";
import { ROUTE_OBJEKTE } from "@/routes/routes";

export async function deleteLocal(localId: string) {
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
    .delete(locals)
    .where(and(eq(locals.id, localId)))
    .returning();

  if (result.length === 0) {
    throw new Error("Einheit nicht gefunden oder keine Berechtigung");
  }

  revalidatePath(`${ROUTE_OBJEKTE}`);

  return { success: true };
}
