import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";

/**
 * POST /api/download-heating-bill
 * Returns a presigned URL for an already-generated heating bill PDF.
 * Accepts: { objektId, localId, docId }
 * Returns: { presignedUrl } or 404 if PDF does not exist.
 */
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

    const body = await request.json().catch(() => ({}));
    const { objektId, localId, docId } = body as {
      objektId?: string;
      localId?: string;
      docId?: string;
    };

    if (!docId || !objektId || !localId) {
      return NextResponse.json(
        { error: "Missing required fields: objektId, localId, docId" },
        { status: 400 }
      );
    }

    const storagePath = `${user.id}/${objektId}/${localId}/heating-bill_${docId}.pdf`;

    const { data: signedData, error: signedError } =
      await supabase.storage
        .from("documents")
        .createSignedUrl(storagePath, 3600, { download: true });

    if (signedError || !signedData?.signedUrl) {
      return NextResponse.json(
        { error: "PDF not found or not ready yet" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      presignedUrl: signedData.signedUrl,
    });
  } catch (error: unknown) {
    console.error("Download heating bill error:", error);
    return NextResponse.json(
      {
        error: "Failed to get download URL",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
