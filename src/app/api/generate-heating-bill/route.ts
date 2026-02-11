import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseServer } from "@/utils/supabase/server";
import { pdf } from "@react-pdf/renderer";
import React from "react";
import HeidiSystemsPdf from "@/components/Admin/Docs/Render/HeidiSystemsPdf/HeidiSystemsPdf";
import { mockHeatingBillModel } from "@/lib/heating-bill/mock-model";
import { fetchHeatingBillData } from "@/lib/heating-bill/data-fetcher";
import { computeHeatingBill } from "@/lib/heating-bill/compute";

/**
 * POST /api/generate-heating-bill
 * Server-side heating bill PDF generation.
 * Accepts: { objektId, localId, docId, debug?: boolean }
 * Returns: { documentId, presignedUrl, metadata }
 *
 * Step 1 shadow mode: computes real model from data, logs vs mock, still renders mock.
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
    const { objektId, localId, docId, debug } = body as {
      objektId?: string;
      localId?: string;
      docId?: string;
      debug?: boolean;
    };

    if (!docId) {
      return NextResponse.json(
        { error: "Missing required field: docId" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Server configuration error - missing Supabase env" },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // Step 1 shadow mode: compute real model from data, compare to mock, still render mock.
    let model = mockHeatingBillModel;
    let computedModel: typeof model | null = null;

    try {
      const raw = await fetchHeatingBillData(docId, user.id, {
        useServiceRole: true,
      });
      computedModel = computeHeatingBill(raw);
      if (process.env.NODE_ENV === "development" || debug) {
        const mockGrandTotal = mockHeatingBillModel.buildingCalc?.grandTotal ?? 0;
        const computedGrandTotal =
          computedModel.buildingCalc?.grandTotal ?? 0;
        const diff = Math.abs(computedGrandTotal - mockGrandTotal);
        console.log(
          "[HeatingBill] Shadow: mock grandTotal",
          mockGrandTotal,
          "computed",
          computedGrandTotal,
          "diff",
          diff.toFixed(2)
        );
      }
    } catch (fetchError) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[HeatingBill] Shadow compute failed, using mock:", fetchError);
      }
    }

    // Still render mock until Step 2+ migration; computedModel used only for logging/debug

    // Render PDF to buffer (works in Node.js API route)
    const pdfDoc = pdf(
      React.createElement(HeidiSystemsPdf, { model })
    );
    const buffer = await pdfDoc.toBuffer();

    // Upload path: {userId}/heating-bill_{docId}.pdf
    const storagePath = `${user.id}/${objektId}/${localId}/heating-bill_${docId}.pdf`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("documents")
      .upload(storagePath, buffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("Heating bill PDF upload error:", uploadError);
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Insert documents record
    const { data: docRecord, error: insertError } = await supabaseAdmin
      .from("documents")
      .insert({
        document_name: `Heizkostenabrechnung_${docId}.pdf`,
        document_url: storagePath,
        related_id: docId,
        related_type: "heating_bill",
        user_id: user.id,
      })
      .select("id")
      .single();

    if (insertError || !docRecord) {
      console.error("Documents insert error:", insertError);
      return NextResponse.json(
        { error: `Failed to save document record: ${insertError?.message ?? "unknown"}` },
        { status: 500 }
      );
    }

    // Create signed URL (1 hour)
    const { data: signedData, error: signedError } =
      await supabaseAdmin.storage
        .from("documents")
        .createSignedUrl(storagePath, 3600);

    if (signedError || !signedData?.signedUrl) {
      return NextResponse.json(
        { error: `Failed to create signed URL: ${signedError?.message ?? "unknown"}` },
        { status: 500 }
      );
    }

    const response: {
      documentId: string;
      presignedUrl: string;
      metadata: { storagePath: string };
      debugModel?: typeof model;
      debugComputedModel?: typeof model;
    } = {
      documentId: docRecord.id,
      presignedUrl: signedData.signedUrl,
      metadata: { storagePath },
    };

    if (debug) {
      response.debugModel = model;
      if (computedModel) response.debugComputedModel = computedModel;
    }

    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error("Generate heating bill error:", error);
    return NextResponse.json(
      {
        error: "PDF generation failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
