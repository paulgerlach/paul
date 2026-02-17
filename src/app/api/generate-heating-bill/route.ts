import { NextRequest, NextResponse } from "next/server";
import path from "node:path";
import { supabaseServer } from "@/utils/supabase/server";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import HeidiSystemsPdf from "@/components/Admin/Docs/Render/HeidiSystemsPdf/HeidiSystemsPdf";
import { mockHeatingBillModel, fetchHeatingBillData, computeHeatingBill, validateModel } from "@/app/api/generate-heating-bill/_lib";
import { sendHeatingBillNotification } from "@/lib/slackNotifications";

/** When "true" or "1", always use mock model (for testing/rollback). Default: use computed model. */
const HEATING_BILL_USE_MOCK =
  process.env.HEATING_BILL_USE_MOCK === "true" ||
  process.env.HEATING_BILL_USE_MOCK === "1";

/**
 * POST /api/generate-heating-bill
 * Server-side heating bill PDF generation.
 * Accepts: { objektId, localId, docId, debug?: boolean }
 * Returns: { documentId, presignedUrl, metadata }
 *
 * Uses computed model from DB when HEATING_BILL_USE_MOCK is not set; falls back to mock on error.
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



    // Use computed model unless HEATING_BILL_USE_MOCK is set; fallback to mock on error.
    let model = mockHeatingBillModel;
    let computedModel: typeof model | null = null;
    let validation: { valid: boolean; errors: string[]; warnings: string[] } | null = null;
    let rawData: Awaited<ReturnType<typeof fetchHeatingBillData>> | null = null;

    if (!HEATING_BILL_USE_MOCK) {
      try {
        rawData = await fetchHeatingBillData(docId, user.id, {
          useServiceRole: true,
        });
        computedModel = computeHeatingBill(rawData);
        model = computedModel;
        validation = validateModel(computedModel);
        if (!validation.valid && validation.errors.length > 0) {
          console.warn("[HeatingBill] Validation errors:", validation.errors);
        }
        if (validation.warnings.length > 0) {
          console.warn("[HeatingBill] Validation warnings:", validation.warnings);
        }
        if (process.env.NODE_ENV === "development" || debug) {
          console.log(
            "[HeatingBill] Using computed model, grandTotal",
            computedModel.buildingCalc?.grandTotal?.toFixed(2)
          );
        }
      } catch (fetchError) {
        if (process.env.NODE_ENV === "development") {
          console.warn("[HeatingBill] Compute failed, using mock:", fetchError);
        }
      }
    } else if (process.env.NODE_ENV === "development" || debug) {
      console.log("[HeatingBill] HEATING_BILL_USE_MOCK enabled, using mock model");
    }

    // Resolve logo to absolute file path for server-side rendering
    model = { ...model, logoSrc: path.join(process.cwd(), "public", "admin_logo.png") };

    // Render PDF to buffer (works in Node.js API route)
    const buffer = await renderToBuffer(
      React.createElement(HeidiSystemsPdf, { model }) as any
    );

    // Upload path: {userId}/heating-bill_{docId}.pdf
    const storagePath = `${user.id}/${objektId}/${localId}/heating-bill_${docId}.pdf`;

    const { error: uploadError } = await supabase.storage
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
    const { data: docRecord, error: insertError } = await supabase
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
      await supabase.storage
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
      debugValidation?: { valid: boolean; errors: string[]; warnings: string[] };
    } = {
      documentId: docRecord.id,
      presignedUrl: signedData.signedUrl,
      metadata: { storagePath },
    };

    if (debug) {
      response.debugModel = model;
      if (computedModel) response.debugComputedModel = computedModel;
      if (validation) response.debugValidation = validation;
    }

    // Slack notification (never fails PDF response)
    const matchedLocal = rawData?.locals?.find((l) => l.id === localId);
    const apartmentLabel = matchedLocal
      ? { floor: matchedLocal.floor, house_location: matchedLocal.house_location, living_space: String(matchedLocal.living_space ?? ""), residential_area: undefined }
      : undefined;
    await sendHeatingBillNotification(
      {
        docId,
        userId: user.id,
        userName: rawData?.user ? `${rawData.user.first_name ?? ""} ${rawData.user.last_name ?? ""}`.trim() || user.email || user.id : user.email ?? user.id,
        buildingStreet: rawData?.objekt?.street ?? "",
        buildingZip: rawData?.objekt?.zip ?? "",
        objektId: objektId ?? "",
        useMock: HEATING_BILL_USE_MOCK,
        timestamp: new Date().toISOString(),
      },
      "single",
      1,
      0,
      [
        {
          localId: localId ?? "",
          presignedUrl: signedData.signedUrl,
          floor: apartmentLabel?.floor ?? null,
          house_location: apartmentLabel?.house_location ?? null,
          living_space: apartmentLabel?.living_space ?? null,
          residential_area: apartmentLabel?.residential_area ?? null,
        },
      ]
    ).catch((err) => console.error("[HeatingBill] Slack notification error:", err));

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
