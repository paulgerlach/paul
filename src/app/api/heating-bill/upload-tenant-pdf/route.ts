import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";
import { createClient } from "@supabase/supabase-js";
import database from "@/db";
import { documents, users } from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
    try {
        const supabase = await supabaseServer();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized - Please login" },
                { status: 401 }
            );
        }

        // Check super_admin permission
        const [userData] = await database
            .select({ permission: users.permission })
            .from(users)
            .where(eq(users.id, user.id));

        if (!userData || userData.permission !== "super_admin") {
            console.warn(`Unauthorized PDF overwrite attempt by user: ${user.id}`);
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const documentId = formData.get("documentId") as string | null;

        if (!file || !documentId) {
            return NextResponse.json(
                { error: "Missing required fields: file, documentId" },
                { status: 400 }
            );
        }

        if (file.type !== "application/pdf") {
            return NextResponse.json(
                { error: "Invalid file type. Only PDF is allowed." },
                { status: 400 }
            );
        }

        // Fetch the original document to retain its associations
        const [originalDoc] = await database
            .select()
            .from(documents)
            .where(eq(documents.id, documentId));

        if (!originalDoc) {
            return NextResponse.json(
                { error: "Original document not found" },
                { status: 404 }
            );
        }

        // Read the file buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // Upload to Supabase Storage using service role to bypass potential RLS
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!supabaseUrl || !serviceRoleKey) {
            throw new Error("Missing Supabase config for upload");
        }
        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

        const timestamp = Date.now();
        // E.g. user_id/objekt_id/local_id/heating-bill_docId_contractId_v1234567.pdf
        // Instead of parsing the path complexly, we'll append the timestamp to the filename
        const originalExtMatch = originalDoc.document_url.match(/(\.pdf)$/i);
        let newStoragePath: string;
        if (originalExtMatch) {
            newStoragePath = originalDoc.document_url.replace(
                /(\.pdf)$/i,
                `_v${timestamp}$1`
            );
        } else {
            newStoragePath = `${originalDoc.document_url}_v${timestamp}.pdf`;
        }

        const { error: uploadError } = await supabaseAdmin.storage
            .from("documents")
            .upload(newStoragePath, buffer, {
                contentType: "application/pdf",
                upsert: true,
            });

        if (uploadError) {
            console.error("Super Admin PDF upload error:", uploadError);
            return NextResponse.json(
                { error: `Upload failed: ${uploadError.message}` },
                { status: 500 }
            );
        }

        // Database Phase: Versioning strategy

        // 1. Mark original document as not current
        await database
            .update(documents)
            .set({ current_document: false })
            .where(eq(documents.id, originalDoc.id));

        // 2. Insert the new document record
        const [newDocRecord] = await database
            .insert(documents)
            .values({
                document_name: originalDoc.document_name,
                document_url: newStoragePath,
                related_id: originalDoc.related_id,
                related_type: originalDoc.related_type,
                user_id: originalDoc.user_id,
                local_id: originalDoc.local_id,
                current_document: true,
            })
            .returning({ id: documents.id });

        if (!newDocRecord) {
            return NextResponse.json(
                { error: "Failed to update database document record" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, documentId: newDocRecord.id },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error("Upload tenant PDF error:", error);
        return NextResponse.json(
            { error: "File upload failed", details: String(error) },
            { status: 500 }
        );
    }
}
