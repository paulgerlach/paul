/**
 * Invoice aggregation by cost_type. Classifies into billing sections:
 * energy, heating operating, distribution, cold water.
 */
import type { HeatingInvoiceType } from "@/types";
import {
  ENERGY_COST_TYPES,
  HEATING_OPERATING_TYPES,
  DISTRIBUTION_COST_TYPES,
  COLD_WATER_COST_TYPES,
  IGNORED_COST_TYPES,
} from "./constants";
import { formatEuro, formatDateGerman } from "@/utils";

export type EnergyInvoiceItem = {
  label: string;
  date: string;
  kWh: number;
  kWhFormatted: string;
  amount: number;
  amountFormatted: string;
};

export type EnergyReliefItem = {
  label: string;
  amount: number;
  amountFormatted: string;
};

export type HeatingCostItem = {
  label: string;
  date: string;
  amount: number;
  amountFormatted: string;
};

export type DistributionCostItem = {
  label: string;
  amount: number;
  amountFormatted: string;
};

export type CostAggregation = {
  energyInvoices: EnergyInvoiceItem[];
  energyRelief: EnergyReliefItem | null;
  energyTotalKwh: number;
  energyTotalAmount: number;

  heatingCostItems: HeatingCostItem[];
  heatingCostCarryOver: number;
  heatingCostTotal: number;

  distributionCostItems: DistributionCostItem[];
  distributionCostTotal: number;
  grandTotal: number;

  coldWaterInvoices: HeatingInvoiceType[];
  coldWaterTotal: number;
};

/** Round to 2 decimals for currency */
function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

/** Round to 6 decimals for rates */
function round6(v: number): number {
  return Math.round(v * 1_000_000) / 1_000_000;
}

/**
 * Parse kWh from invoice. May be in notes, purpose, or passed from readings.
 * Returns 0 if not found.
 */
function parseKwhFromInvoice(inv: HeatingInvoiceType): number {
  const notes = inv.notes ?? "";
  const purpose = inv.purpose ?? "";
  const combined = `${notes} ${purpose}`;
  // Look for numbers that could be kWh (e.g. "761123" or "761.123")
  const match = combined.match(/(\d+[.,]?\d*)\s*(?:kwh|kWh|KWh)?/i);
  if (match) {
    const val = parseFloat(match[1].replace(",", "."));
    return isNaN(val) ? 0 : round6(val);
  }
  return 0;
}

/**
 * Check if invoice is energy relief (Preisbremse) - negative amount or purpose.
 */
function isEnergyRelief(inv: HeatingInvoiceType): boolean {
  const amount = Number(inv.total_amount ?? 0);
  const purpose = (inv.purpose ?? "").toLowerCase();
  return amount < 0 || purpose.includes("preisbremse");
}

/**
 * Aggregate heating invoices by cost_type into billing sections.
 * Energy kWh: parsed from invoice notes/purpose, or use supplied readingsTotalKwh.
 */
export function aggregateInvoiceCosts(
  invoices: HeatingInvoiceType[],
  options?: { readingsTotalKwh?: number }
): CostAggregation {
  const readingsTotalKwh = options?.readingsTotalKwh ?? 0;

  const energyInvoices: EnergyInvoiceItem[] = [];
  let energyRelief: EnergyReliefItem | null = null;
  let energyTotalKwh = 0;
  let energyTotalAmount = 0;

  const heatingCostItems: HeatingCostItem[] = [];
  let heatingCostCarryOver = 0;
  let heatingCostTotal = 0;

  const distributionCostItems: DistributionCostItem[] = [];
  let distributionCostTotal = 0;

  const coldWaterInvoices: HeatingInvoiceType[] = [];
  let coldWaterTotal = 0;

  const costTypeMap = (ct: string | null | undefined): string =>
    (ct ?? "").toLowerCase().replace(/\s/g, "_");

  for (const inv of invoices) {
    const ct = costTypeMap(inv.cost_type);
    const amount = round2(Number(inv.total_amount ?? 0));
    const date = formatDateGerman(inv.invoice_date ?? undefined);
    const label =
      inv.document_name || inv.purpose || `Rechnung ${inv.id?.slice(0, 8) ?? ""}`;

    if (IGNORED_COST_TYPES.includes(ct as any)) continue;

    if (ENERGY_COST_TYPES.includes(ct as any)) {
      if (isEnergyRelief(inv)) {
        energyRelief = {
          label: inv.purpose || "Preisbremse Energie",
          amount,
          amountFormatted: formatEuro(amount),
        };
      } else {
        let kWh = parseKwhFromInvoice(inv);
        if (kWh === 0 && readingsTotalKwh > 0 && energyInvoices.length === 0) {
          kWh = readingsTotalKwh;
        }
        energyInvoices.push({
          label,
          date,
          kWh,
          kWhFormatted: new Intl.NumberFormat("de-DE", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
          }).format(kWh),
          amount,
          amountFormatted: formatEuro(amount),
        });
        energyTotalKwh += kWh;
        energyTotalAmount += amount;
      }
      continue;
    }

    if (HEATING_OPERATING_TYPES.includes(ct as any)) {
      heatingCostItems.push({
        label: inv.purpose || inv.document_name || ct,
        date,
        amount,
        amountFormatted: formatEuro(amount),
      });
      heatingCostTotal += amount;
      continue;
    }

    if (DISTRIBUTION_COST_TYPES.includes(ct as any)) {
      distributionCostItems.push({
        label: inv.purpose || inv.document_name || ct,
        amount,
        amountFormatted: formatEuro(amount),
      });
      distributionCostTotal += amount;
      continue;
    }

    if (COLD_WATER_COST_TYPES.includes(ct as any)) {
      coldWaterInvoices.push(inv);
      coldWaterTotal += amount;
      continue;
    }

    // Unknown type: place in heating operating as "Sonstige"
    heatingCostItems.push({
      label: inv.purpose || inv.document_name || ct || "Sonstige",
      date,
      amount,
      amountFormatted: formatEuro(amount),
    });
    heatingCostTotal += amount;
  }

  // Energy total = sum(energy invoices) + relief (relief is negative)
  energyTotalAmount = round2(
    energyInvoices.reduce((s, i) => s + i.amount, 0) + (energyRelief?.amount ?? 0)
  );
  // Heating carry-over (Übertrag) = energy total going into heating costs table
  heatingCostCarryOver = energyTotalAmount;
  // Heating total = carry-over + operating items (Betriebsstrom, Wartung, etc.)
  heatingCostTotal = round2(
    heatingCostCarryOver + heatingCostItems.reduce((s, i) => s + i.amount, 0)
  );

  const grandTotal = round2(heatingCostTotal + distributionCostTotal);

  return {
    energyInvoices,
    energyRelief,
    energyTotalKwh,
    energyTotalAmount: round2(energyTotalAmount + (energyRelief?.amount ?? 0)),
    heatingCostItems,
    heatingCostCarryOver,
    heatingCostTotal,
    distributionCostItems,
    distributionCostTotal,
    grandTotal,
    coldWaterInvoices,
    coldWaterTotal,
  };
}
