import { NextResponse } from "next/server";
import { sendNewsletterEvent } from "@/utils/webhooks";

export async function POST(req: Request) {
    const { email } = await req.json();

    try {
        // ✅ NEW: Use unified webhook with event_type
        await sendNewsletterEvent(email);
        
        console.log(`[NEWSLETTER] Sent newsletter signup event for ${email}`);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[NEWSLETTER] Error sending webhook:', error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
