"use server";

import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import database from "@/db";
import { objekte } from "@/db/drizzle/schema";
import { supabaseServer } from "@/utils/supabase/server";
import { ROUTE_OBJEKTE } from "@/routes/routes";

export async function deleteObjekt(objektId: string) {
  const supabase = await supabaseServer();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    console.error("Auth error:", error);
    throw new Error("Nicht authentifiziert");
  }
  if (!user.id) {
    throw new Error("Benutzer-ID nicht gefunden");
  }

  const result = await database
    .delete(objekte)
    .where(and(eq(objekte.id, objektId), eq(objekte.user_id, user.id)))
    .returning();

  if (result.length === 0) {
    throw new Error("Objekt nicht gefunden oder keine Berechtigung");
  }

  revalidatePath(ROUTE_OBJEKTE);

  return { success: true };
}