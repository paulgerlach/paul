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
} from "@/app/api/heating-bill/_lib";
import type { TenantOverride } from "@/app/api/heating-bill/_lib";
import { getRelatedLocalsByObjektId } from "@/api";
import { sendHeatingBillNotification } from "@/lib/slackNotifications";
import { supabaseServer } from "@/utils/supabase/server";
import { formatDateGerman } from "@/utils";
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

/* ------------------------------------------------------------------ */
/*  Tenant‑segment helpers                                            */
/* ------------------------------------------------------------------ */

type TenantSegment = {
    contractId: string;           // contract id, or "leerstand_<idx>" for vacancy
    contractorsNames: string;
    overlapStart: Date;
    overlapEnd: Date;
    timeFraction: number;         // days overlap / total billing days
};

/**
 * Compute ordered, non-overlapping tenant segments for one locale within
 * the billing period.  Gaps are filled with "Leerstand" segments.
 */
function computeTenantSegments(
    contracts: Array<{
        id: string;
        local_id: string | null;
        rental_start_date: string;
        rental_end_date: string | null;
        contractors: Array<{ first_name: string; last_name: string; id: string }>;
    }>,
    localId: string,
    periodStart: Date,
    periodEnd: Date,
): TenantSegment[] {
    const totalDays = Math.max(1, diffDays(periodStart, periodEnd));

    // Only contracts that overlap the billing period and belong to this local
    const overlapping = contracts
        .filter((c) => {
            if (c.local_id !== localId) return false;
            const cStart = new Date(c.rental_start_date);
            const cEnd = c.rental_end_date ? new Date(c.rental_end_date) : null;
            return cStart <= periodEnd && (!cEnd || cEnd >= periodStart);
        })
        .map((c) => ({
            ...c,
            overlapStart: maxDate(new Date(c.rental_start_date), periodStart),
            overlapEnd: minDate(
                c.rental_end_date ? new Date(c.rental_end_date) : periodEnd,
                periodEnd
            ),
        }))
        .sort((a, b) => a.overlapStart.getTime() - b.overlapStart.getTime());

    if (overlapping.length === 0) {
        // Entire period is vacant
        return [{
            contractId: "leerstand_0",
            contractorsNames: "Leerstand",
            overlapStart: periodStart,
            overlapEnd: periodEnd,
            timeFraction: 1,
        }];
    }

    const segments: TenantSegment[] = [];
    let cursor = periodStart;
    let leerstandIdx = 0;

    for (const c of overlapping) {
        // Gap before this contract?
        if (c.overlapStart > cursor) {
            const gapDays = diffDays(cursor, c.overlapStart);
            if (gapDays > 0) {
                segments.push({
                    contractId: `leerstand_${leerstandIdx++}`,
                    contractorsNames: "Leerstand",
                    overlapStart: cursor,
                    overlapEnd: new Date(c.overlapStart.getTime() - 86400000), // day before
                    timeFraction: gapDays / totalDays,
                });
            }
        }
        const overlapDays = diffDays(c.overlapStart, c.overlapEnd);
        const names = c.contractors.length > 0
            ? c.contractors.map((ct) => `${ct.first_name} ${ct.last_name}`).join(", ")
            : "Leerstand";
        segments.push({
            contractId: c.id,
            contractorsNames: names,
            overlapStart: c.overlapStart,
            overlapEnd: c.overlapEnd,
            timeFraction: Math.max(0.001, overlapDays / totalDays),
        });
        // Move cursor past this contract
        cursor = new Date(c.overlapEnd.getTime() + 86400000); // day after
    }

    // Gap after the last contract?
    if (cursor <= periodEnd) {
        const gapDays = diffDays(cursor, periodEnd);
        if (gapDays > 0) {
            segments.push({
                contractId: `leerstand_${leerstandIdx}`,
                contractorsNames: "Leerstand",
                overlapStart: cursor,
                overlapEnd: periodEnd,
                timeFraction: gapDays / totalDays,
            });
        }
    }

    return segments;
}

function diffDays(a: Date, b: Date): number {
    return Math.max(0, Math.round((b.getTime() - a.getTime()) / 86400000) + 1);
}

function maxDate(a: Date, b: Date): Date { return a > b ? a : b; }
function minDate(a: Date, b: Date): Date { return a < b ? a : b; }

/* ------------------------------------------------------------------ */
/*  Batch processor                                                   */
/* ------------------------------------------------------------------ */

type ApartmentEntry = {
    localId: string;
    floor?: string | null;
    house_location?: string | null;
    living_space?: string | null;
    residential_area?: string | null;
    tenants: Array<{
        contractId: string;
        contractorsNames: string;
        presignedUrl?: string;
    }>;
};

/**
 * Background worker: computes model, renders PDF, uploads per local+tenant
 * with error isolation.  Uses service-role Supabase.
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
    apartments: ApartmentEntry[];
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

    const logoSrc = path.join(process.cwd(), "public", "admin_logo.png");
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

    // Compute billing period from document
    const periodStart = raw?.mainDoc?.start_date
        ? new Date(raw.mainDoc.start_date)
        : new Date();
    const periodEnd = raw?.mainDoc?.end_date
        ? new Date(raw.mainDoc.end_date)
        : new Date();

    const apartments: ApartmentEntry[] = [];
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

                // Determine tenant segments for this locale
                const segments: TenantSegment[] =
                    raw?.contractsWithContractors && raw.mainDoc
                        ? computeTenantSegments(
                            raw.contractsWithContractors,
                            localId,
                            periodStart,
                            periodEnd,
                        )
                        : []; // empty means mock mode — will produce single PDF

                const tenantEntries: ApartmentEntry["tenants"] = [];

                if (segments.length === 0) {
                    // Mock mode or no contract data — generate single PDF as before
                    const computedModel = raw
                        ? computeHeatingBill(raw, { targetLocalId: localId })
                        : mockHeatingBillModel;
                    const validation = validateModel(computedModel);
                    if (!validation.valid && validation.errors.length > 0) {
                        console.warn("[HeatingBillBatch] Validation errors:", {
                            localId,
                            errors: validation.errors,
                        });
                    }
                    const model = { ...computedModel, logoSrc };
                    const buffer = await renderPdf(model);
                    const storagePath = `${userId}/${objektId}/${localId}/heating-bill_${docId}_default.pdf`;
                    await uploadPdf(supabase, storagePath, buffer);
                    tenantEntries.push({
                        contractId: "default",
                        contractorsNames: model.cover.contractorsNames,
                    });
                    generated++;
                } else {
                    // Generate one PDF per tenant segment
                    for (const seg of segments) {
                        const tenantOverride: TenantOverride = {
                            contractId: seg.contractId,
                            contractorsNames: seg.contractorsNames,
                            timeFraction: seg.timeFraction,
                            overlapStart: seg.overlapStart,
                            overlapEnd: seg.overlapEnd,
                            usagePeriodStart: formatDateGerman(seg.overlapStart.toISOString()) ?? "",
                            usagePeriodEnd: formatDateGerman(seg.overlapEnd.toISOString()) ?? "",
                        };
                        const computedModel = computeHeatingBill(raw!, {
                            targetLocalId: localId,
                            tenantOverride,
                        });
                        const validation = validateModel(computedModel);
                        if (!validation.valid && validation.errors.length > 0) {
                            console.warn("[HeatingBillBatch] Validation errors:", {
                                localId,
                                contractId: seg.contractId,
                                errors: validation.errors,
                            });
                        }
                        const model = { ...computedModel, logoSrc };
                        const buffer = await renderPdf(model);
                        const storagePath = `${userId}/${objektId}/${localId}/heating-bill_${docId}_${seg.contractId}.pdf`;
                        await uploadPdf(supabase, storagePath, buffer);
                        tenantEntries.push({
                            contractId: seg.contractId,
                            contractorsNames: seg.contractorsNames,
                        });
                        generated++;
                    }
                }

                apartments.push({
                    localId,
                    floor: local.floor ?? null,
                    house_location: local.house_location ?? null,
                    living_space: local.living_space ? String(local.living_space) : null,
                    residential_area: local.residential_area ?? null,
                    tenants: tenantEntries,
                });
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

    // ---- Enrichment for Slack notification ----
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
        totalTenants = apartments.reduce((sum, a) => sum + a.tenants.length, 0);
    } catch (error_) {
        console.warn("[HeatingBillBatch] Enrichment fetch failed (non-fatal):", error_);
    }

    // ---- Generate presigned URLs for all uploaded PDFs ----
    const allTenantPdfs = apartments.flatMap((apt) =>
        apt.tenants.map((t) => ({ apt, tenant: t }))
    );
    for (let i = 0; i < allTenantPdfs.length; i += UPLOAD_BATCH_SIZE) {
        const batch = allTenantPdfs.slice(i, i + UPLOAD_BATCH_SIZE);
        const signedResults = await Promise.allSettled(
            batch.map(async ({ apt, tenant }) => {
                const storagePath = `${userId}/${objektId}/${apt.localId}/heating-bill_${docId}_${tenant.contractId}.pdf`;
                const signOnce = async () =>
                    supabase.storage
                        .from("documents")
                        .createSignedUrl(storagePath, 172800, { download: true });
                let response = await signOnce();
                if (response.error || !response.data?.signedUrl) {
                    response = await signOnce();
                }
                if (response.error || !response.data?.signedUrl) {
                    throw response.error ?? new Error("Failed to create signed URL");
                }
                tenant.presignedUrl = response.data.signedUrl;
            })
        );
        for (let j = 0; j < signedResults.length; j++) {
            const r = signedResults[j];
            if (r.status === "rejected") {
                const entry = batch[j];
                console.warn(
                    `[HeatingBillBatch] Signed URL generation failed for local ${entry?.apt.localId}/${entry?.tenant.contractId}:`,
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
        apartments,
        failedEntries,
    };
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

async function renderPdf(model: any): Promise<Buffer> {
    return renderToBuffer(
        React.createElement(HeidiSystemsPdf, { model }) as any
    );
}

async function uploadPdf(
    supabase: any,
    storagePath: string,
    buffer: Buffer
): Promise<void> {
    const { error } = await supabase.storage
        .from("documents")
        .upload(storagePath, buffer, {
            contentType: "application/pdf",
            upsert: true,
        });
    if (error) throw error;
}

/* ------------------------------------------------------------------ */
/*  POST handler                                                      */
/* ------------------------------------------------------------------ */

/**
 * POST /api/heating-bill/generate/batch
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
                apartments: result.apartments,
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
