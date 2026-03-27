import database from "@/db";
import { documents, heating_invoices } from "@/db/drizzle/schema";
import { and, desc, eq, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { sanitizeFileName } from "@/utils/file";
import { supabaseServer } from "@/utils/supabase/server";
import { isSuperAdmin } from "@/auth";
import { createClient } from "@supabase/supabase-js";

/**
 * GET /api/heating-bill/invoice-document-url?relatedId=<doc_id>&documentName=<name>
 * Resolves uploaded invoice document path and returns a presigned download URL.
 */
export async function GET(request: NextRequest) {
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
    const hasSuperAdminAccess = await isSuperAdmin(user.id);
    if (!hasSuperAdminAccess) {
      return NextResponse.json(
        { error: "Forbidden - Super admin access required" },
        { status: 403 }
      );
    }

    const relatedId = request.nextUrl.searchParams.get("relatedId");
    const documentName = request.nextUrl.searchParams.get("documentName");
    const invoiceId = request.nextUrl.searchParams.get("invoiceId");

    if (!relatedId || !documentName) {
      return NextResponse.json(
        { error: "Missing relatedId or documentName" },
        { status: 400 }
      );
    }

    const normalizedName = documentName.trim();
    const strippedUuidPrefixName = normalizedName.replace(
      /^[0-9a-fA-F-]{36}_/,
      ""
    );
    const relatedIdCandidates = new Set<string>([relatedId]);
    const filenameCandidates = new Set<string>([
      normalizedName,
      strippedUuidPrefixName,
      sanitizeFileName(normalizedName),
      sanitizeFileName(strippedUuidPrefixName),
    ]);

    if (invoiceId) {
      const invoice = await database
        .select({
          heating_doc_id: heating_invoices.heating_doc_id,
          document_name: heating_invoices.document_name,
        })
        .from(heating_invoices)
        .where(eq(heating_invoices.id, invoiceId))
        .then((rows) => rows[0] ?? null);

      if (invoice?.heating_doc_id) {
        relatedIdCandidates.add(invoice.heating_doc_id);
      }

      if (invoice?.document_name) {
        const invoiceDocumentName = invoice.document_name.trim();
        const invoiceNameWithoutPrefix = invoiceDocumentName.replace(
          /^[0-9a-fA-F-]{36}_/,
          ""
        );

        filenameCandidates.add(invoiceDocumentName);
        filenameCandidates.add(invoiceNameWithoutPrefix);
        filenameCandidates.add(sanitizeFileName(invoiceDocumentName));
        filenameCandidates.add(sanitizeFileName(invoiceNameWithoutPrefix));
      }
    }

    const normalizedFilenameCandidates = Array.from(
      new Set([
        ...filenameCandidates,
        ...Array.from(filenameCandidates).map((name) =>
          name.replaceAll("%20", " ")
        ),
      ])
    ).filter(Boolean);

    const docRecords = await database
      .select({
        id: documents.id,
        document_name: documents.document_name,
        document_url: documents.document_url,
        created_at: documents.created_at,
      })
      .from(documents)
      .where(
        and(
          inArray(documents.related_id, Array.from(relatedIdCandidates)),
          eq(documents.related_type, "heating_bill")
        )
      )
      .orderBy(desc(documents.created_at));

    const docRecord =
      docRecords.find((record) => {
        const name = record.document_name ?? "";
        const path = record.document_url ?? "";

        return normalizedFilenameCandidates.some(
          (candidate) =>
            name === candidate ||
            path.endsWith(`/${candidate}`) ||
            path.endsWith(`_${candidate}`) ||
            path.endsWith(`/${relatedId}_${candidate}`)
        );
      }) ?? docRecords[0] ?? null;

    if (!docRecord) {
      return NextResponse.json(
        { error: "Invoice document not found" },
        { status: 404 }
      );
    }
    if (!docRecord.document_url) {
      return NextResponse.json(
        { error: "Invoice document path is missing" },
        { status: 404 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Supabase service role is not configured" },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const { data: signedData, error: signedError } = await supabaseAdmin.storage
      .from("documents")
      .createSignedUrl(docRecord.document_url, 3600, { download: true });

    if (signedError || !signedData?.signedUrl) {
      return NextResponse.json(
        {
          error: `Failed to create signed URL: ${
            signedError?.message ?? "unknown"
          }`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ presignedUrl: signedData.signedUrl });
  } catch (error: unknown) {
    console.error("Invoice document URL error:", error);
    return NextResponse.json(
      {
        error: "Failed to get invoice document URL",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
