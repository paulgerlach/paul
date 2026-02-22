import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";

/**
 * POST /api/heating-bill/download
 * Returns presigned URL(s) for already-generated heating bill PDF(s).
 *
 * Accepts: { objektId, localId, docId, contractId? }
 *   - When contractId is provided: returns a single presigned URL for that tenant's PDF.
 *   - When contractId is absent: tries to list all tenant PDFs for the locale
 *     and returns presigned URLs for each.
 *
 * Returns: { presignedUrl, tenantUrls? } or 404 if no PDF found.
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
    const { objektId, localId, docId, contractId } = body as {
      objektId?: string;
      localId?: string;
      docId?: string;
      contractId?: string;
    };

    if (!docId || !objektId || !localId) {
      return NextResponse.json(
        { error: "Missing required fields: objektId, localId, docId" },
        { status: 400 }
      );
    }

    // Single tenant download
    if (contractId) {
      const storagePath = `${user.id}/${objektId}/${localId}/heating-bill_${docId}_${contractId}.pdf`;
      const { data: signedData, error: signedError } =
        await supabase.storage
          .from("documents")
          .createSignedUrl(storagePath, 172800, { download: true });
      if (signedError || !signedData?.signedUrl) {
        return NextResponse.json(
          { error: "PDF not found or not ready yet" },
          { status: 404 }
        );
      }
      return NextResponse.json({ presignedUrl: signedData.signedUrl });
    }

    // Multi-tenant: list all PDFs in the locale folder matching the docId pattern
    const folderPath = `${user.id}/${objektId}/${localId}`;
    const prefix = `heating-bill_${docId}_`;
    const { data: files, error: listError } = await supabase.storage
      .from("documents")
      .list(folderPath, { limit: 50 });

    const matchingFiles = (files ?? []).filter(
      (f) => f.name.startsWith(prefix) && f.name.endsWith(".pdf")
    );

    if (listError || matchingFiles.length === 0) {
      // Fallback: try legacy single-file path (pre multi-tenant)
      const legacyPath = `${user.id}/${objektId}/${localId}/heating-bill_${docId}.pdf`;
      const { data: legacyData, error: legacyError } =
        await supabase.storage
          .from("documents")
          .createSignedUrl(legacyPath, 172800, { download: true });
      if (legacyError || !legacyData?.signedUrl) {
        return NextResponse.json(
          { error: "PDF not found or not ready yet" },
          { status: 404 }
        );
      }
      return NextResponse.json({ presignedUrl: legacyData.signedUrl });
    }

    // Sign all matching files
    const tenantUrls: Array<{
      contractId: string;
      presignedUrl: string;
    }> = [];

    for (const file of matchingFiles) {
      const filePath = `${folderPath}/${file.name}`;
      const { data: signed } = await supabase.storage
        .from("documents")
        .createSignedUrl(filePath, 172800, { download: true });
      if (signed?.signedUrl) {
        // Extract contractId from filename: heating-bill_{docId}_{contractId}.pdf
        const fileContractId = file.name
          .replace(prefix, "")
          .replace(".pdf", "");
        tenantUrls.push({
          contractId: fileContractId,
          presignedUrl: signed.signedUrl,
        });
      }
    }

    if (tenantUrls.length === 0) {
      return NextResponse.json(
        { error: "PDF not found or not ready yet" },
        { status: 404 }
      );
    }

    // Return first URL as presignedUrl for backward compat, plus all tenant URLs
    return NextResponse.json({
      presignedUrl: tenantUrls[0].presignedUrl,
      tenantUrls,
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
