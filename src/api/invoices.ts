import type { ProcessInvoiceResponse } from "@/types";

export async function processInvoicesViaNext(files: File[]) {
    const fd = new FormData();
    files.forEach((f) => fd.append("files", f));

    const res = await fetch("/api/invoices/process", {
        method: "POST",
        headers: { accept: "application/json" },
        body: fd,
        // DO NOT set Content-Type
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Failed (${res.status})`);
    }

    return res.json();
}

export function mapCostCategoryToPurpose(
    costCategory: string | null | undefined,
    purposeOptions: string[] | undefined
): string | null {
    if (!costCategory || !purposeOptions?.length) return null;

    // 1) Exact match
    const exact = purposeOptions.find((o) => o === costCategory);
    if (exact) return exact;

    const cc = costCategory.toLowerCase();

    // 2) Keyword rules -> pick best fitting purpose
    // Adjust keywords anytime.
    if (
        cc.includes("reinigung") ||
        cc.includes("clean") ||
        cc.includes("kehr") ||
        cc.includes("wartung") && cc.includes("reinigung")
    ) {
        return purposeOptions.find((o) => o.toLowerCase().includes("reinigung")) ?? null;
    }

    if (
        cc.includes("wartung") ||
        cc.includes("service") ||
        cc.includes("brenner") ||
        cc.includes("heizung") ||
        cc.includes("inspektion")
    ) {
        return (
            purposeOptions.find((o) => o.toLowerCase().includes("wartung")) ?? null
        );
    }

    // 3) No confident mapping
    return null;
}

export function buildInvoiceNotes(invoice: any) {
    const lines: string[] = [];

    const push = (label: string, value: unknown) => {
        if (value === null || value === undefined) return;
        if (typeof value === "string" && value.trim() === "") return;
        lines.push(`${label}: ${String(value)}`);
    };

    push("Datei", invoice.file);
    push("Validiert", invoice.validated);
    push("Jahr", invoice.year);
    push("Draft Action", invoice.draft_action);
    push("Kostenkategorie", invoice.cost_category);
    push("Umlageschlüssel", invoice.allocation_key);

    if (invoice.building?.id) push("Gebäude ID", invoice.building.id);
    if (invoice.building?.address) push("Gebäude Adresse", invoice.building.address);

    push("Zeitraum Start", invoice.period_start);
    push("Zeitraum Ende", invoice.period_end);

    push("Netto", invoice.net_amount);
    push("MwSt", invoice.vat_amount);

    push("Adresse", invoice.address);
    push("Empfänger", invoice.recipient);

    if (invoice.building_check?.confidence)
        push("Building Check Confidence", invoice.building_check.confidence);

    if (Array.isArray(invoice.building_check?.indicators_found) && invoice.building_check.indicators_found.length) {
        lines.push(`Indikatoren: ${invoice.building_check.indicators_found.join(", ")}`);
    }

    if (invoice.building_check?.reason) {
        lines.push(`Begründung (Building Check): ${invoice.building_check.reason}`);
    }

    if (invoice.validation_reason) {
        lines.push(`Validierungsgrund: ${invoice.validation_reason}`);
    }

    const cleaned = lines.filter(Boolean);
    if (!cleaned.length) return "";

    return `\n---\nAutomatisch erkannte Rechnungsdaten:\n${cleaned.join("\n")}\n`;
}
