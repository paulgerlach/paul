import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const data = await req.json();

        const url = process.env.MAKE_FRAGEBOGEN_URL as string;

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: data.email,
                first_name: data.first_name,
                last_name: data.last_name,
                appartment_number: data.appartment_number,
                heating_costs: data.heating_costs,
                heating_available: data.heating_available,
                central_water_supply: data.central_water_supply,
                central_heating_system: data.central_heating_system,
                energy_sources: data.energy_sources,
            }),
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: "Fehler beim Senden der Nachricht." },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: "Serverfehler. Bitte erneut versuchen." },
            { status: 500 }
        );
    }
}
