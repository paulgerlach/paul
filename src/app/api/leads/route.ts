import { NextResponse } from "next/server";
import { saveLeadDB } from "@/services/leadsService";

export async function POST(req: Request) {
    try {
      const { email, source } = await req.json();

      await saveLeadDB(email, source)

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[LEADS] Error saving lead:', error);
        return NextResponse.json(
            { error: "Serverfehler. Bitte erneut versuchen." },
            { status: 500 }
        );
    }
}
