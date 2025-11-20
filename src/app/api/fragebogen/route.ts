import { NextResponse } from "next/server";
import { sendOfferInquiryEvent } from "@/utils/webhooks";

export async function POST(req: Request) {
    try {
        const data = await req.json();

        // ✅ NEW: Use unified webhook with event_type
        // Send all questionnaire data to Denis's Make.com workflow
        await sendOfferInquiryEvent(data.email, {
            first_name: data.first_name,
            last_name: data.last_name,
            appartment_number: data.appartment_number,
            heating_costs: data.heating_costs,
            heating_available: data.heating_available,
            central_water_supply: data.central_water_supply,
            central_heating_system: data.central_heating_system,
            energy_sources: data.energy_sources,
        });
        
        // 🚫 DEPRECATED: Old MAKE_FRAGEBOGEN_URL webhook removed
        // Now using unified webhook: https://hook.eu2.make.com/rfagboxirpwkbck0wkax3qh9nqum12g1
        console.log(`[QUESTIONNAIRE] Sent offer inquiry event for ${data.email}`);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[QUESTIONNAIRE] Error sending webhook:', error);
        return NextResponse.json(
            { error: "Serverfehler. Bitte erneut versuchen." },
            { status: 500 }
        );
    }
}
