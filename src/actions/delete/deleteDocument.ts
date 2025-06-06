"use server";

import database from "@/db";
import { documents } from "@/db/drizzle/schema";
import { supabaseServer } from "@/utils/supabase/server";
import { eq } from "drizzle-orm";

export async function deleteDocumentById(id: string) {
  const supabase = await supabaseServer();
  try {
    // Step 1: Get file info from DB
    const [doc] = await database
      .select()
      .from(documents)
      .where(eq(documents.id, id))
      .limit(1);

    if (!doc) {
      throw new Error("Document not found");
    }

    const { user_id, related_id, document_name: fileName } = doc;
    const storagePath = `${user_id}/${related_id}_${fileName}`;

    const { error: storageError } = await supabase.storage
      .from("documents")
      .remove([storagePath]);

    if (storageError) {
      console.error("Storage deletion error:", storageError);
      throw new Error("Fehler beim Löschen aus dem Speicher");
    }

    // Step 3: Delete DB record
    await database.delete(documents).where(eq(documents.id, id));

    return { success: true };
  } catch (error) {
    console.error("Error deleting document:", error);
    return { success: false, error: String(error) };
  }
}
