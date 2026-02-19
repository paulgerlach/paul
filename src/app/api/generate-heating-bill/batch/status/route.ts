import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";
import { getRelatedLocalsByObjektId } from "@/api";

/**
 * GET /api/generate-heating-bill/batch/status
 * Query params: objektId, docId, localId (optional), localIds (optional, comma-separated)
 *
 * Single-local mode (localId provided): returns { localId, ready } for that local only.
 * Aggregate mode (no localId): returns storage-based readiness for all locals in the building.
 * When localIds is provided in aggregate mode, skips DB lookup and only checks storage.
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

    const { searchParams } = new URL(request.url);
    const objektId = searchParams.get("objektId");
    const docId = searchParams.get("docId");
    const singleLocalId = searchParams.get("localId");
    const localIdsParam = searchParams.get("localIds");

    if (!docId || !objektId) {
      return NextResponse.json(
        { error: "Missing required query params: objektId, docId" },
        { status: 400 }
      );
    }

    // Single-local mode: minimal payload for per-row polling
    if (singleLocalId && singleLocalId.trim()) {
      const storagePath = `${user.id}/${objektId}/${singleLocalId.trim()}/heating-bill_${docId}.pdf`;
      const { error } = await supabase.storage
        .from("documents")
        .createSignedUrl(storagePath, 60, { download: true });
      return NextResponse.json({
        localId: singleLocalId.trim(),
        ready: !error,
      });
    }

    let localIds: string[];
    if (localIdsParam && localIdsParam.trim()) {
      localIds = localIdsParam.split(",").map((id) => id.trim()).filter(Boolean);
    } else {
      const locals = await getRelatedLocalsByObjektId(objektId);
      localIds = (locals ?? []).map((l) => l.id).filter((id): id is string => Boolean(id));
    }

    if (localIds.length === 0) {
      return NextResponse.json(
        {
          totalLocals: 0,
          readyCount: 0,
          pendingCount: 0,
          readyLocalIds: [],
          completed: true,
        },
        { status: 200 }
      );
    }

    const checks = await Promise.all(
      localIds.map(async (localId) => {
        const storagePath = `${user.id}/${objektId}/${localId}/heating-bill_${docId}.pdf`;
        const { error } = await supabase.storage
          .from("documents")
          .createSignedUrl(storagePath, 60, { download: true });
        return { localId, ready: !error };
      })
    );

    const readyLocalIds = checks.filter((c) => c.ready).map((c) => c.localId);
    const readyCount = readyLocalIds.length;
    const pendingCount = localIds.length - readyCount;
    const completed = pendingCount === 0;

    return NextResponse.json({
      totalLocals: localIds.length,
      readyCount,
      pendingCount,
      readyLocalIds,
      completed,
    });
  } catch (error: unknown) {
    console.error("[HeatingBillBatchStatus] Error:", error);
    return NextResponse.json(
      {
        error: "Status check failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
