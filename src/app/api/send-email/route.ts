import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { email } = await req.json();

    try {
        const url = process.env.MAKE_EMAIL_URL as string;

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: "Fehler beim Senden der E-Mail." },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
