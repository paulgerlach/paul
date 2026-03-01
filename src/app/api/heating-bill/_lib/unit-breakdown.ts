/**
 * Unit-level cost breakdown for Page 4.
 * Computes one unit's costs from building rates and unit consumption.
 */
import type { HeatingBillPdfModel, DeviceReadingRow } from "./types";
import type { WarmWaterResult } from "./warmwater";
import type { HeatingRates } from "./rates";
import type { ColdWaterRateItem } from "./coldwater";
import { formatEuro, formatGermanNumber } from "@/utils";

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

export type UnitBreakdownInput = {
  /** Target local for this breakdown */
  localId: string;
  livingSpaceM2: number;
  localLabel?: string;
  /** Building-level heating rates */
  heating: HeatingRates;
  /** Building-level warm water result */
  warmWater: WarmWaterResult;
  /** Building-level cold water rate items */
  coldWaterRateItems: ColdWaterRateItem[];
  /** Device rows filtered to this local only */
  heatingDevices: DeviceReadingRow[];
  warmWaterDevices: DeviceReadingRow[];
  coldWaterDevices: DeviceReadingRow[];
  /** Header fields from cover/objekt */
  contractorsNames: string;
  street: string;
  zip: string;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  createdAt: string;
  /** Energy relief for unit share (optional) */
  energyRelief?: { label: string; amount: number } | null;
  unitCount: number;
  /**
   * Time fraction for multi-tenant proration (0..1).
   * When set, base costs (area-based) are scaled by this fraction.
   * Consumption costs are NOT scaled — they already use tenant-scoped readings.
   */
  timeFraction?: number;
};

/**
 * Compute unit-level breakdown for Page 4.
 */
export function computeUnitBreakdown(input: UnitBreakdownInput): HeatingBillPdfModel["unitBreakdown"] {
  const {
    livingSpaceM2,
    localLabel,
    heating,
    warmWater,
    coldWaterRateItems,
    heatingDevices,
    warmWaterDevices,
    coldWaterDevices,
    contractorsNames,
    street,
    zip,
    billingPeriodStart,
    billingPeriodEnd,
    createdAt,
    energyRelief,
    unitCount,
  } = input;

  const tf = input.timeFraction ?? 1;
  const locationLabel = localLabel ?? "Wohnung";

  // Base costs are area-based — scale by time fraction for multi-tenant proration
  const heatingBaseCost = round2(livingSpaceM2 * heating.baseCostRatePerM2 * tf);
  // Consumption costs use tenant-scoped meter readings — no time scaling needed
  const heatingConsumptionMwh = heatingDevices.reduce((s, d) => s + d.consumption, 0);
  const heatingConsumptionCost = round2(heatingConsumptionMwh * (heating.consumptionCostAmount / Math.max(0.001, heating.consumptionMwh)));

  const warmWaterBaseCost = round2(livingSpaceM2 * warmWater.baseCostRatePerM2 * tf);
  const warmWaterConsumptionM3 = warmWaterDevices.reduce((s, d) => s + d.consumption, 0);
  const warmWaterConsumptionCost = round2(
    warmWaterConsumptionM3 * (warmWater.consumptionCostAmount / Math.max(0.001, warmWater.consumptionCostVolume))
  );

  const heatingAndWarmWaterTotal = round2(
    heatingBaseCost + heatingConsumptionCost + warmWaterBaseCost + warmWaterConsumptionCost
  );

  const unitColdWaterM3 = coldWaterDevices.reduce((s, d) => s + d.consumption, 0);
  const coldWaterItems = coldWaterRateItems.map((item) => {
    const volume =
      item.unit === "Nutzeinh."
        ? 1
        : unitColdWaterM3 || 0;
    // Per-unit flat fees are prorated by time; consumption-based items use actual readings
    const costMultiplier = item.unit === "Nutzeinh." ? tf : 1;
    const cost = round2(volume * item.rate * costMultiplier);
    return {
      label: item.label,
      volume,
      volumeFormatted: formatGermanNumber(volume, item.unit === "Nutzeinh." ? 0 : 2),
      unit: item.unit,
      rate: item.rate,
      rateFormatted: item.rateFormatted,
      rateUnit: item.rateUnit,
      cost,
      costFormatted: formatEuro(cost),
    };
  });

  const coldWaterTotal = round2(coldWaterItems.reduce((s, i) => s + i.cost, 0));

  const grandTotal = round2(heatingAndWarmWaterTotal + coldWaterTotal);

  const deviceRowsWithLocation = (rows: DeviceReadingRow[]) =>
    rows.map((r) => ({ ...r, location: r.location || locationLabel }));

  const heatingTotal = heatingConsumptionMwh;
  const warmWaterTotal = warmWaterConsumptionM3;
  const coldWaterTotalM3 = unitColdWaterM3;

  const unitCountSafe = Math.max(1, unitCount);
  const reliefUnitShare = energyRelief
    ? round2((energyRelief.amount / unitCountSafe) * tf)
    : 0;

  return {
    contractorsNames,
    street,
    zip,
    billingPeriodStart,
    billingPeriodEnd,
    createdAt,
    livingSpaceM2,
    livingSpaceM2Formatted: formatGermanNumber(livingSpaceM2, 2),
    heatingBaseCost,
    heatingBaseCostFormatted: formatEuro(heatingBaseCost),
    heatingBaseCostCalc: `${formatGermanNumber(livingSpaceM2, 2)} m² x ${heating.baseCostRatePerM2Formatted} €/m²`,
    heatingConsumptionMwh,
    heatingConsumptionMwhFormatted: formatGermanNumber(heatingConsumptionMwh, 2),
    heatingConsumptionCost,
    heatingConsumptionCostFormatted: formatEuro(heatingConsumptionCost),
    heatingConsumptionCalc: `${formatGermanNumber(heatingConsumptionMwh, 2)} MWh x ${heating.consumptionCostRatePerMwhFormatted} €/MWh`,
    warmWaterBaseCost,
    warmWaterBaseCostFormatted: formatEuro(warmWaterBaseCost),
    warmWaterBaseCostCalc: `${formatGermanNumber(livingSpaceM2, 2)} m² x ${warmWater.baseCostRatePerM2Formatted} €/m²`,
    warmWaterConsumptionM3,
    warmWaterConsumptionM3Formatted: formatGermanNumber(warmWaterConsumptionM3, 2),
    warmWaterConsumptionCost,
    warmWaterConsumptionCostFormatted: formatEuro(warmWaterConsumptionCost),
    warmWaterConsumptionCalc: `${formatGermanNumber(warmWaterConsumptionM3, 2)} m³ x ${warmWater.consumptionCostRatePerM3Formatted} €/m³`,
    heatingAndWarmWaterTotal,
    heatingAndWarmWaterTotalFormatted: formatEuro(heatingAndWarmWaterTotal),
    coldWaterItems,
    coldWaterTotal,
    coldWaterTotalFormatted: formatEuro(coldWaterTotal),
    grandTotal,
    grandTotalFormatted: formatEuro(grandTotal),
    stateRelief:
      energyRelief && reliefUnitShare !== 0
        ? {
          label: energyRelief.label,
          buildingTotal: energyRelief.amount,
          buildingTotalFormatted: formatEuro(energyRelief.amount),
          unitShare: reliefUnitShare,
          unitShareFormatted: formatEuro(reliefUnitShare),
        }
        : null,
    heatingDevices: deviceRowsWithLocation(heatingDevices),
    warmWaterDevices: deviceRowsWithLocation(warmWaterDevices),
    coldWaterDevices: deviceRowsWithLocation(coldWaterDevices),
    heatingDevicesTotal: heatingTotal,
    heatingDevicesTotalFormatted: formatGermanNumber(heatingTotal, 2),
    warmWaterDevicesTotal: warmWaterTotal,
    warmWaterDevicesTotalFormatted: formatGermanNumber(warmWaterTotal, 2),
    coldWaterDevicesTotal: coldWaterTotalM3,
    coldWaterDevicesTotalFormatted: formatGermanNumber(coldWaterTotalM3, 2),
  };
}
