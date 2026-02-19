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
import { eq, inArray } from "drizzle-orm";
import type { LocalType, UnitType } from "@/types";

/** Explicit timeout for route; request waits for full batch generation. */
export const maxDuration = 60;

/** When "true" or "1", always use mock model (for testing/rollback). */
const HEATING_BILL_USE_MOCK =
    process.env.HEATING_BILL_USE_MOCK === "true" ||
    process.env.HEATING_BILL_USE_MOCK === "1";

const UPLOAD_BATCH_SIZE = 5;
const ALLOWED_HEATING_BILL_USAGE_TYPES = new Set<UnitType>([
    "residential",
    "commercial",
]);

/**
 * Background worker: computes model, renders PDF, uploads per local with error isolation.
 * Uses service-role Supabase so it runs without request context.
 */
async function processBatchInBackground(
    userId: string,
    objektId: string,
    docId: string,
    locals: LocalType[]
): Promise<{
    generated: number;
    failed: number;
    totalLocals: number;
    failedEntries: Array<{
        localId: string;
        floor?: string | null;
        house_location?: string | null;
        living_space?: string | null;
        residential_area?: string | null;
        errorMessage?: string;
    }>;
}> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error("Missing Supabase config for batch generation");
    }
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    let model = mockHeatingBillModel;
    let raw: Awaited<ReturnType<typeof fetchHeatingBillData>> | null = null;
    if (!HEATING_BILL_USE_MOCK) {
        try {
            raw = await fetchHeatingBillData(docId, userId, {
                useServiceRole: true,
            });
            if (!raw.mainDoc || !raw.objekt) {
                console.warn(
                    "[HeatingBillBatch] mainDoc or objekt missing — computed model will use mock data",
                    { docId, initiatorUserId: userId, mainDocUserId: raw.mainDoc?.user_id ?? null }
                );
            }
            model = computeHeatingBill(raw);
            const validation = validateModel(model);
            if (!validation.valid && validation.errors.length > 0) {
                console.warn("[HeatingBillBatch] Validation errors:", validation.errors);
            }
        } catch (fetchError) {
            let errorForLog: unknown = fetchError;
            if (process.env.NODE_ENV !== "development") {
                errorForLog =
                    fetchError instanceof Error ? fetchError.message : String(fetchError);
            }
            console.warn(
                "[HeatingBillBatch] Compute failed, using mock:",
                errorForLog
            );
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
    } catch (error_) {
        console.error("[HeatingBillBatch] PDF render failed:", error_);
        throw new Error("PDF render failed");
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
        const objektRow =
            raw?.objekt ??
            (await database
                .select({
                    id: objekte.id,
                    street: objekte.street,
                    zip: objekte.zip,
                    user_id: objekte.user_id,
                })
                .from(objekte)
                .where(eq(objekte.id, objektId))
                .then((r) => r[0] ?? null));
        const ownerUserId = objektRow?.user_id ?? null;
        const rawUserId = raw?.user?.id;
        const needsInitiatorLookup = !raw?.user;
        const needsOwnerLookup = Boolean(
            ownerUserId && rawUserId !== ownerUserId
        );
        const userIdsToFetch = Array.from(
            new Set(
                [
                    needsInitiatorLookup ? userId : null,
                    needsOwnerLookup ? ownerUserId : null,
                ].filter((id): id is string => Boolean(id))
            )
        );
        const userRows = userIdsToFetch.length
            ? await database
                .select({
                    id: users.id,
                    first_name: users.first_name,
                    last_name: users.last_name,
                })
                .from(users)
                .where(inArray(users.id, userIdsToFetch))
            : [];
        const userRowsById = new Map(userRows.map((row) => [row.id, row]));
        const initiatorRow = needsInitiatorLookup
            ? userRowsById.get(userId) ?? null
            : null;
        let ownerRow: { first_name: string | null; last_name: string | null } | null = null;
        if (ownerUserId) {
            if (rawUserId === ownerUserId && raw?.user) {
                ownerRow = raw.user;
            } else {
                ownerRow = userRowsById.get(ownerUserId) ?? null;
            }
        }
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
    } catch (error_) {
        console.warn("[HeatingBillBatch] Enrichment fetch failed (non-fatal):", error_);
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

    return {
        generated,
        failed,
        totalLocals: locals.length,
        failedEntries,
    };
}

/**
 * POST /api/generate-heating-bill/batch
 * Generates heating bill PDFs for all locals in a building.
 * Accepts: { objektId, docId }
 * Returns after generation with 200 { success, totalLocals, generated, failed }.
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
        const eligibleLocals = (locals ?? []).filter((local) =>
            ALLOWED_HEATING_BILL_USAGE_TYPES.has(local.usage_type as UnitType)
        );
        if (eligibleLocals.length === 0) {
            return NextResponse.json(
                {
                    success: true,
                    completed: true,
                    totalLocals: 0,
                    generated: 0,
                    failed: 0,
                    failedEntries: [],
                },
                { status: 200 }
            );
        }

        const result = await processBatchInBackground(
            user.id,
            objektId,
            docId,
            eligibleLocals
        );

        return NextResponse.json(
            {
                success: true,
                completed: true,
                totalLocals: result.totalLocals,
                generated: result.generated,
                failed: result.failed,
                failedEntries: result.failedEntries,
            },
            { status: 200 }
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
