import { NextResponse } from "next/server";
import { sendWebhookEvent } from "@/utils/webhooks";

export async function POST(req: Request) {
    try {
        const { name, email, message } = await req.json();

        // ✅ NEW: Use unified webhook with event_type 'contactform'
        // Send contact form data to Denis's Make.com workflow
        await sendWebhookEvent('contactform', email, {
            first_name: name,
            message: message,
        });

        console.log(`[CONTACT] Sent contact form event for ${email}`);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[CONTACT] Error sending webhook:', error);
        return NextResponse.json(
            { error: "Serverfehler. Bitte erneut versuchen." },
            { status: 500 }
        );
    }
}
