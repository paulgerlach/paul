import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
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

        const contentType = req.headers.get("content-type") || "";

        if (!contentType.includes("multipart/form-data")) {
            return NextResponse.json(
                { error: "Expected multipart/form-data", receivedContentType: contentType },
                { status: 400 }
            );
        }

        const MAX_BODY_BYTES = 200 * 1024 * 1024; // 200 MB ceiling
        const contentLength = Number(req.headers.get("content-length") ?? 0);
        if (contentLength > MAX_BODY_BYTES) {
            return NextResponse.json(
                { error: "Payload too large. Maximum total upload size is 200 MB." },
                { status: 413 }
            );
        }

        const arrayBuffer = await req.arrayBuffer();
        const body = new Uint8Array(arrayBuffer);

        if (body.byteLength > MAX_BODY_BYTES) {
            return NextResponse.json(
                { error: "Payload too large. Maximum total upload size is 200 MB." },
                { status: 413 }
            );
        }

        const upstreamRes = await fetch("https://heididoc.vercel.app/api/invoices/process/", {
            method: "POST",
            headers: {
                accept: "application/json",
                "content-type": contentType, // includes boundary from the browser request
                // If the API requires auth, forward it like this:
                // authorization: req.headers.get("authorization") ?? "",
            },
            body,
        });

        const text = await upstreamRes.text();

        return new NextResponse(text, {
            status: upstreamRes.status,
            headers: { "content-type": upstreamRes.headers.get("content-type") || "application/json" },
        });
    } catch (e: any) {
        return NextResponse.json(
            { error: e?.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
