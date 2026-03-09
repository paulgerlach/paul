/**
 * Cold water rate computation for Page 3.
 * Builds rateItems from cold water invoices and meter readings.
 */
import type { HeatingInvoiceType } from "@/types";
import { COLD_WATER_SUBTYPE_MAP } from "./constants";
import { formatEuro, formatGermanNumber } from "@/utils";

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

function round6(v: number): number {
  return Math.round(v * 1_000_000) / 1_000_000;
}

function getSubtypeConfig(inv: HeatingInvoiceType): {
  label: string;
  unit: "m3" | "nutzeinh";
  decimals: number;
} {
  const ct = (inv.cost_type ?? "").toLowerCase().replace(/\s/g, "_");
  const purpose = (inv.purpose ?? "").toLowerCase();
  const doc = (inv.document_name ?? "").toLowerCase();
  const combined = `${ct} ${purpose} ${doc}`;

  if (combined.includes("abwasser") || ct.includes("abwasser")) {
    return COLD_WATER_SUBTYPE_MAP.abwasser ?? { label: "Abwasser Gesamt", unit: "m3", decimals: 6 };
  }
  if (
    combined.includes("gerätemiete") ||
    combined.includes("geratemiete") ||
    combined.includes("device_rental") ||
    combined.includes("miete")
  ) {
    return COLD_WATER_SUBTYPE_MAP.cold_water_device_rental ?? { label: "Gerätemiete Kaltwasser", unit: "m3", decimals: 6 };
  }
  if (
    combined.includes("abrechnung") ||
    combined.includes("billing") ||
    ct.includes("abrechnung")
  ) {
    return COLD_WATER_SUBTYPE_MAP.cold_water_billing ?? { label: "Abrechnung Kaltwasser", unit: "nutzeinh", decimals: 2 };
  }
  return COLD_WATER_SUBTYPE_MAP.cold_water ?? { label: "Kaltwasser", unit: "m3", decimals: 6 };
}

export type ColdWaterRateItem = {
  label: string;
  totalCost: number;
  totalCostFormatted: string;
  totalVolume: number;
  totalVolumeFormatted: string;
  unit: string;
  rate: number;
  rateFormatted: string;
  rateUnit: string;
  /** "sqm" when no cold water readings — unit cost uses localSqm × rate; "consumption" otherwise */
  allocationMode: "sqm" | "consumption";
};

export type ColdWaterResult = {
  totalCost: number;
  totalCostFormatted: string;
  rateItems: ColdWaterRateItem[];
  unitTotalCost: number;
  unitTotalCostFormatted: string;
  /** True when no cold water meter readings are available; costs are allocated by sqm in unit breakdown */
  noReadings: boolean;
};

/**
 * Compute cold water rates for Page 3 from invoices, volume, and unit count.
 */
export function computeColdWaterRates(
  coldWaterInvoices: HeatingInvoiceType[],
  totalColdWaterM3: number,
  unitCount: number,
  totalLivingSpaceM2: number,
  localLivingSpaceM2?: number
): ColdWaterResult {
  const unitCountSafe = Math.max(1, unitCount);
  const totalM3Safe = Math.max(0.001, totalColdWaterM3);
  const noReadings = totalColdWaterM3 === 0;

  // Group by subtype (label)
  const bySubtype = new Map<
    string,
    { label: string; unit: "m3" | "nutzeinh"; decimals: number; amount: number }
  >();

  for (const inv of coldWaterInvoices) {
    const config = getSubtypeConfig(inv);
    const amount = round2(Number(inv.total_amount ?? 0));
    const existing = bySubtype.get(config.label);
    if (existing) {
      existing.amount += amount;
    } else {
      bySubtype.set(config.label, { ...config, amount });
    }
  }

  const rateItems: ColdWaterRateItem[] = [];
  let totalCost = 0;

  for (const [, item] of bySubtype) {
    totalCost += item.amount;

    if (noReadings && item.unit === "m3") {
      // No readings: allocate by sqm (€/m² rate)
      const rate = totalLivingSpaceM2 > 0 ? round6(item.amount / totalLivingSpaceM2) : 0;
      rateItems.push({
        label: item.label,
        totalCost: item.amount,
        totalCostFormatted: formatEuro(item.amount),
        totalVolume: totalLivingSpaceM2,
        totalVolumeFormatted: formatGermanNumber(totalLivingSpaceM2, 2),
        unit: "m²",
        rate,
        rateFormatted: formatGermanNumber(rate, item.decimals),
        rateUnit: "€/m²",
        allocationMode: "sqm",
      });
    } else {
      const volume = item.unit === "m3" ? totalM3Safe : unitCountSafe;
      const rate = volume > 0 ? round6(item.amount / volume) : 0;
      const volumeFormatted =
        item.unit === "m3"
          ? formatGermanNumber(totalM3Safe, 2)
          : formatGermanNumber(unitCountSafe, 0);
      const unit = item.unit === "m3" ? "m³" : "Nutzeinh.";
      const rateUnit = item.unit === "m3" ? "€/m³" : "€/Nutzeinh.";
      rateItems.push({
        label: item.label,
        totalCost: item.amount,
        totalCostFormatted: formatEuro(item.amount),
        totalVolume: volume,
        totalVolumeFormatted: volumeFormatted,
        unit,
        rate,
        rateFormatted: formatGermanNumber(rate, item.decimals),
        rateUnit,
        allocationMode: "consumption",
      });
    }
  }

  // Fallback if no cold water invoices: one placeholder item
  if (rateItems.length === 0) {
    totalCost = 0;
    rateItems.push({
      label: "Kaltwasser",
      totalCost: 0,
      totalCostFormatted: formatEuro(0),
      totalVolume: noReadings ? totalLivingSpaceM2 : totalM3Safe,
      totalVolumeFormatted: noReadings
        ? formatGermanNumber(totalLivingSpaceM2, 2)
        : formatGermanNumber(totalM3Safe, 2),
      unit: noReadings ? "m²" : "m³",
      rate: 0,
      rateFormatted: "0",
      rateUnit: noReadings ? "€/m²" : "€/m³",
      allocationMode: noReadings ? "sqm" : "consumption",
    });
  }

  // Unit share: proportional by living space for m³/m² items, equal split for per-unit items
  let unitTotalCost = 0;
  const localSpace = localLivingSpaceM2 ?? 0;
  const spaceShare =
    totalLivingSpaceM2 > 0 && localSpace > 0
      ? localSpace / totalLivingSpaceM2
      : 1 / unitCountSafe;

  for (const item of rateItems) {
    if (item.unit === "m³" || item.unit === "m²") {
      unitTotalCost += item.totalCost * spaceShare;
    } else {
      unitTotalCost += item.totalCost / unitCountSafe;
    }
  }
  unitTotalCost = round2(unitTotalCost);

  return {
    totalCost,
    totalCostFormatted: formatEuro(totalCost),
    rateItems,
    unitTotalCost,
    unitTotalCostFormatted: formatEuro(unitTotalCost),
    noReadings,
  };
}
