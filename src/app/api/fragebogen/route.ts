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
            // Over50 flow fields
            property_count_category: data.property_count_category,
            messdienstleister_count: data.messdienstleister_count,
            zusammenarbeit_status: data.zusammenarbeit_status,
            akuter_handlungsbedarf: data.akuter_handlungsbedarf,
            // Under50 flow fields
            wohnungen_count: data.wohnungen_count,
            funkzaehler_status: data.funkzaehler_status,
            standort_schwerpunkt: data.standort_schwerpunkt,
            // Contact form fields
            verwaltung_name: data.verwaltung_name,
            postleitzahl: data.postleitzahl,
            ort: data.ort,
            // Legacy fields
            appartment_number: data.appartment_number,
            heating_costs: data.heating_costs,
            heating_available: data.heating_available,
            central_water_supply: data.central_water_supply,
            central_heating_system: data.central_heating_system,
            energy_sources: data.energy_sources,
        });
        
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
