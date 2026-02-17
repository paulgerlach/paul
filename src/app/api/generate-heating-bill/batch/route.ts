import { NextRequest, NextResponse } from "next/server";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
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
import { sendHeatingBillNotification } from "@/lib/slackNotifications";
import { supabaseServer } from "@/utils/supabase/server";
import database from "@/db";
import { objekte, users } from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";
import type { LocalType } from "@/types";

/** Explicit timeout for route; 202 is returned quickly, background work runs outside request lifecycle. */
export const maxDuration = 60;

/** When "true" or "1", always use mock model (for testing/rollback). */
const HEATING_BILL_USE_MOCK =
    process.env.HEATING_BILL_USE_MOCK === "true" ||
    process.env.HEATING_BILL_USE_MOCK === "1";

const UPLOAD_BATCH_SIZE = 5;

/**
 * Background worker: computes model, renders PDF, uploads per local with error isolation.
 * Uses service-role Supabase so it runs without request context.
 */
async function processBatchInBackground(
    userId: string,
    objektId: string,
    docId: string,
    locals: LocalType[]
): Promise<void> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
        console.error("[HeatingBillBatch] Missing Supabase config for background run");
        return;
    }
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    let model = mockHeatingBillModel;
    let raw: Awaited<ReturnType<typeof fetchHeatingBillData>> | null = null;
    if (!HEATING_BILL_USE_MOCK) {
        try {
            raw = await fetchHeatingBillData(docId, userId, {
                useServiceRole: true,
            });
            model = computeHeatingBill(raw);
            const validation = validateModel(model);
            if (!validation.valid && validation.errors.length > 0) {
                console.warn("[HeatingBillBatch] Validation errors:", validation.errors);
            }
        } catch (fetchError) {
            if (process.env.NODE_ENV === "development") {
                console.warn("[HeatingBillBatch] Compute failed, using mock:", fetchError);
            }
        }
    }

    model = {
        ...model,
        logoSrc: path.join(process.cwd(), "public", "admin_logo.png"),
    };

    let buffer: Buffer;
    try {
        buffer = await renderToBuffer(
            React.createElement(HeidiSystemsPdf, { model }) as any
        );
    } catch (renderErr) {
        console.error("[HeatingBillBatch] PDF render failed:", renderErr);
        return;
    }

    const apartments: Array<{
        localId: string;
        presignedUrl?: string;
        floor?: string | null;
        house_location?: string | null;
        living_space?: string | null;
        residential_area?: string | null;
    }> = [];
    const failedEntries: Array<{
        localId: string;
        floor?: string | null;
        house_location?: string | null;
        living_space?: string | null;
        residential_area?: string | null;
        errorMessage?: string;
    }> = [];
    let generated = 0;
    let failed = 0;

    for (let i = 0; i < locals.length; i += UPLOAD_BATCH_SIZE) {
        const batch = locals.slice(i, i + UPLOAD_BATCH_SIZE);
        const results = await Promise.allSettled(
            batch.map(async (local) => {
                const localId = local.id;
                if (!localId) {
                    throw new Error("Missing local id");
                }
                const storagePath = `${userId}/${objektId}/${localId}/heating-bill_${docId}.pdf`;
                const { error: uploadError } = await supabase.storage
                    .from("documents")
                    .upload(storagePath, buffer, {
                        contentType: "application/pdf",
                        upsert: true,
                    });
                if (uploadError) {
                    throw uploadError;
                }
                apartments.push({
                    localId,
                    floor: local.floor ?? null,
                    house_location: local.house_location ?? null,
                    living_space: local.living_space ? String(local.living_space) : null,
                    residential_area: local.residential_area ?? null,
                });
                generated++;
            })
        );
        for (let j = 0; j < results.length; j++) {
            const r = results[j];
            if (r.status === "rejected") {
                failed++;
                const local = batch[j];
                failedEntries.push({
                    localId: local?.id ?? "unknown",
                    floor: local?.floor ?? null,
                    house_location: local?.house_location ?? null,
                    living_space: local?.living_space ? String(local.living_space) : null,
                    residential_area: local?.residential_area ?? null,
                    errorMessage: r.reason?.message ?? String(r.reason),
                });
            }
        }
    }

    let userName = userId;
    let customerName = userId;
    let hasOwnerName = false;
    let buildingStreet = "";
    let buildingZip = "";
    let totalTenants: number | undefined;
    try {
        const objektRow = await database
            .select()
            .from(objekte)
            .where(eq(objekte.id, objektId))
            .then((r) => r[0] ?? null);
        const [initiatorRow, ownerRow] = await Promise.all([
            database
                .select({
                    first_name: users.first_name,
                    last_name: users.last_name,
                })
                .from(users)
                .where(eq(users.id, userId))
                .then((r) => r[0] ?? null),
            objektRow?.user_id
                ? database
                      .select({
                          first_name: users.first_name,
                          last_name: users.last_name,
                      })
                      .from(users)
                      .where(eq(users.id, objektRow.user_id))
                      .then((r) => r[0] ?? null)
                : Promise.resolve(null),
        ]);
        if (raw?.user) {
            userName =
                `${raw.user.first_name ?? ""} ${raw.user.last_name ?? ""}`.trim() ||
                userName;
        } else if (initiatorRow) {
            userName =
                `${initiatorRow.first_name ?? ""} ${initiatorRow.last_name ?? ""}`.trim() ||
                userName;
        }
        if (ownerRow) {
            const ownerName = `${ownerRow.first_name ?? ""} ${ownerRow.last_name ?? ""}`.trim();
            if (ownerName) {
                customerName = ownerName;
                hasOwnerName = true;
            }
        }
        if (!hasOwnerName) {
            customerName = userName;
        }
        buildingStreet = raw?.objekt?.street ?? objektRow?.street ?? "";
        buildingZip = raw?.objekt?.zip ?? objektRow?.zip ?? "";
        if (raw?.mainDoc?.start_date && raw?.mainDoc?.end_date && raw?.contractsWithContractors) {
            const periodStart = new Date(raw.mainDoc.start_date);
            const periodEnd = new Date(raw.mainDoc.end_date);
            const overlapping = raw.contractsWithContractors.filter((c) => {
                const start = new Date(c.rental_start_date);
                const end = c.rental_end_date ? new Date(c.rental_end_date) : null;
                return start <= periodEnd && (!end || end >= periodStart);
            });
            totalTenants = overlapping.reduce((sum, c) => sum + (c.contractors?.length ?? 0), 0);
        }
    } catch (dbErr) {
        console.warn("[HeatingBillBatch] Enrichment fetch failed (non-fatal):", dbErr);
    }

    for (let i = 0; i < apartments.length; i += UPLOAD_BATCH_SIZE) {
        const batch = apartments.slice(i, i + UPLOAD_BATCH_SIZE);
        const signedResults = await Promise.allSettled(
            batch.map(async (apt) => {
                const storagePath = `${userId}/${objektId}/${apt.localId}/heating-bill_${docId}.pdf`;
                const signOnce = async () =>
                    supabase.storage
                        .from("documents")
                        .createSignedUrl(storagePath, 3600, { download: true });
                let response = await signOnce();
                if (response.error || !response.data?.signedUrl) {
                    // One lightweight retry helps with transient storage signing failures.
                    response = await signOnce();
                }
                if (response.error || !response.data?.signedUrl) {
                    throw response.error ?? new Error("Failed to create signed URL");
                }
                // Mutate source apartment object directly so ordering/replacement can't drift.
                apt.presignedUrl = response.data.signedUrl;
            })
        );
        for (let j = 0; j < signedResults.length; j++) {
            const r = signedResults[j];
            if (r.status === "rejected") {
                const localId = batch[j]?.localId ?? "unknown";
                console.warn(
                    `[HeatingBillBatch] Signed URL generation failed for local ${localId}:`,
                    r.reason
                );
            }
        }
    }

    await sendHeatingBillNotification(
        {
            docId,
            userId,
            userName: userName || userId,
            customerName: customerName || userId,
            buildingStreet,
            buildingZip,
            objektId,
            useMock: HEATING_BILL_USE_MOCK,
            timestamp: new Date().toISOString(),
            totalApartments: locals.length,
            totalTenants,
        },
        "batch",
        generated,
        failed,
        apartments,
        failedEntries
    ).catch((err) =>
        console.error("[HeatingBillBatch] Slack notification error:", err)
    );
}

/**
 * POST /api/generate-heating-bill/batch
 * Generates heating bill PDFs for all locals in a building.
 * Accepts: { objektId, docId }
 * Returns immediately with 202 { started, totalLocals }; generation runs in background.
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
                { success: true, started: false, totalLocals: 0, generated: 0, failed: 0 },
                { status: 200 }
            );
        }

        processBatchInBackground(user.id, objektId, docId, locals).catch((err) =>
            console.error("[HeatingBillBatch] Background processing error:", err)
        );

        return NextResponse.json(
            {
                success: true,
                started: true,
                totalLocals: locals.length,
            },
            { status: 202 }
        );
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
