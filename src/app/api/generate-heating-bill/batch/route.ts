import { NextRequest, NextResponse } from "next/server";
import path from "node:path";
import { supabaseServer } from "@/utils/supabase/server";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import HeidiSystemsPdf from "@/components/Admin/Docs/Render/HeidiSystemsPdf/HeidiSystemsPdf";
import {
    mockHeatingBillModel,
    fetchHeatingBillData,
    computeHeatingBill,
    validateModel,
} from "@/app/api/generate-heating-bill/_lib";
import { getRelatedLocalsByObjektId } from "@/api";

/** When "true" or "1", always use mock model (for testing/rollback). */
const HEATING_BILL_USE_MOCK =
    process.env.HEATING_BILL_USE_MOCK === "true" ||
    process.env.HEATING_BILL_USE_MOCK === "1";

/**
 * POST /api/generate-heating-bill/batch
 * Generates heating bill PDFs for all locals in a building.
 * Accepts: { objektId, docId }
 * Returns: { success: true, generated: number, failed: number }
 *
 * Fire-and-forget: caller redirects immediately; generation runs in background.
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
        const { objektId, docId } = body as { objektId?: string; docId?: string };

        if (!docId || !objektId) {
            return NextResponse.json(
                { error: "Missing required fields: objektId, docId" },
                { status: 400 }
            );
        }

        const locals = await getRelatedLocalsByObjektId(objektId);
        if (!locals || locals.length === 0) {
            return NextResponse.json(
                { success: true, generated: 0, failed: 0, message: "No locals found" },
                { status: 200 }
            );
        }

        // Fetch and compute once (building-level data shared across all locals)
        let model = mockHeatingBillModel;
        if (!HEATING_BILL_USE_MOCK) {
            try {
                const raw = await fetchHeatingBillData(docId, user.id, {
                    useServiceRole: true,
                });
                model = computeHeatingBill(raw);
                const validation = validateModel(model);
                if (!validation.valid && validation.errors.length > 0) {
                    console.warn(
                        "[HeatingBillBatch] Validation errors:",
                        validation.errors
                    );
                }
            } catch (fetchError) {
                if (process.env.NODE_ENV === "development") {
                    console.warn(
                        "[HeatingBillBatch] Compute failed, using mock:",
                        fetchError
                    );
                }
            }
        }

        // Resolve logo for server-side rendering
        model = {
            ...model,
            logoSrc: path.join(process.cwd(), "public", "admin_logo.png"),
        };

        // Render PDF once (same content for all locals)
        const buffer = await renderToBuffer(
            React.createElement(HeidiSystemsPdf, { model }) as any
        );

        let generated = 0;
        let failed = 0;

        for (const local of locals) {
            const localId = local.id;
            if (!localId) {
                failed++;
                continue;
            }

            const storagePath = `${user.id}/${objektId}/${localId}/heating-bill_${docId}.pdf`;

            const { error: uploadError } = await supabase.storage
                .from("documents")
                .upload(storagePath, buffer, {
                    contentType: "application/pdf",
                    upsert: true,
                });

            if (uploadError) {
                console.error(
                    `[HeatingBillBatch] Upload failed for local ${localId}:`,
                    uploadError
                );
                failed++;
            } else {
                generated++;
            }
        }

        return NextResponse.json({
            success: true,
            generated,
            failed,
        });
    } catch (error: unknown) {
        console.error("Generate heating bills batch error:", error);
        return NextResponse.json(
            {
                error: "Batch PDF generation failed",
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}
