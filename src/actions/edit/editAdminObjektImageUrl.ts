"use server";

import database from "@/db";
import { objekte } from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";
import { getAuthenticatedServerUser } from "@/utils/auth/server";

export async function editAdminObjektImageUrl(id: string, imageUrl: string) {
  const user = await getAuthenticatedServerUser();

  if (!user) {
    throw new Error("Nicht authentifiziert");
  }

  try {
    await database
      .update(objekte)
      .set({
        image_url: imageUrl
      })
      .where(eq(objekte.id, id));
  } catch (e) {
    console.error("Failed to update objekt:", e);
    throw new Error("Fehler beim Aktualisieren des Objekts");
  }
}
