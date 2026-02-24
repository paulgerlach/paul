import { NextRequest, NextResponse } from "next/server";
import database from "@/db";
import { documents } from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";
import { supabaseServer } from "@/utils/supabase/server";

/**
 * GET /api/heating-bill/document-url/[documentId]
 * Looks up the document_url from the documents table and returns a presigned URL.
 */
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ documentId: string }> },
) {
    try {
        const supabase = await supabaseServer();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized - Please login" },
                { status: 401 },
            );
        }

        const { documentId } = await params;

        if (!documentId) {
            return NextResponse.json(
                { error: "Missing documentId" },
                { status: 400 },
            );
        }

        // Look up the document record
        const docRecord = await database
            .select({
                id: documents.id,
                document_url: documents.document_url,
                user_id: documents.user_id,
            })
            .from(documents)
            .where(eq(documents.id, documentId))
            .then((rows) => rows[0] ?? null);

        if (!docRecord) {
            return NextResponse.json(
                { error: "Document not found" },
                { status: 404 },
            );
        }

        // Create a presigned URL from the stored document_url (storage path)
        const { data: signedData, error: signedError } = await supabase.storage
            .from("documents")
            .createSignedUrl(docRecord.document_url, 3600);

        if (signedError || !signedData?.signedUrl) {
            return NextResponse.json(
                { error: `Failed to create signed URL: ${signedError?.message ?? "unknown"}` },
                { status: 500 },
            );
        }

        return NextResponse.json({ presignedUrl: signedData.signedUrl });
    } catch (error: unknown) {
        console.error("Document URL error:", error);
        return NextResponse.json(
            {
                error: "Failed to get document URL",
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 },
        );
    }
}
