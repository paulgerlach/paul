import { NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";
import { getAuthenticatedServerUser } from "@/utils/auth/server";

export async function GET() {
	try {
		const user = await getAuthenticatedServerUser();
		const supabase = await supabaseServer();

		const { data, error } = await supabase
			.from("users")
			.select("has_seen_tour")
			.eq("id", user.id)
			.single();

		if (error) {
			// If the row is missing or RLS blocks it, default to "seen" = false
			// so we don't accidentally skip the tour forever.
			return NextResponse.json(
				{ success: false, seen: false, error: error.message },
				{ status: 200 }
			);
		}

		return NextResponse.json({
			success: true,
			seen: Boolean((data as any)?.has_seen_tour),
		});
	} catch (e) {
		const message = e instanceof Error ? e.message : "Internal server error";
		// If unauthenticated, treat as seen to avoid running tour on public pages.
		return NextResponse.json({ success: false, seen: true, error: message });
	}
}

export async function POST() {
	try {
		const user = await getAuthenticatedServerUser();
		const supabase = await supabaseServer();

		const { error } = await supabase
			.from("users")
			.update({ has_seen_tour: true })
			.eq("id", user.id);

		if (error) {
			return NextResponse.json(
				{ success: false, error: error.message },
				{ status: 500 }
			);
		}

		return NextResponse.json({ success: true, seen: true });
	} catch (e) {
		const message = e instanceof Error ? e.message : "Internal server error";
		return NextResponse.json({ success: false, error: message }, { status: 500 });
	}
}

