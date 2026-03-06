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
  /** Building total living space m² — required for sqm-based fallback allocation */
  totalLivingSpaceM2: number;
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
  /**
   * Building-level consumption unit: "MWh" for Wärmezähler, "Nutzeinh." for HCA.
   * Controls calc string labels and warm water zeroing.
   */
  consumptionUnit?: string;
};

/**
 * Compute unit-level breakdown for Page 4.
 */
export function computeUnitBreakdown(input: UnitBreakdownInput): HeatingBillPdfModel["unitBreakdown"] {
  const {
    livingSpaceM2,
    totalLivingSpaceM2,
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
  const cUnit = input.consumptionUnit ?? "MWh";
  const isHca = cUnit === "Nutzeinh.";
  const sqmShare = totalLivingSpaceM2 > 0 ? livingSpaceM2 / totalLivingSpaceM2 : 0;

  // Heat: sqm fallback when no readings — allocate 100% of heating cost by sqm
  const heatingBaseCost = heating.noReadings
    ? round2(heating.totalCost * sqmShare * tf)
    : round2(livingSpaceM2 * heating.baseCostRatePerM2 * tf);
  const heatingConsumptionValue = heating.noReadings
    ? 0
    : heatingDevices.reduce((s, d) => s + d.consumption, 0);
  const heatingConsumptionCost = heating.noReadings
    ? 0
    : round2(heatingConsumptionValue * (heating.consumptionCostAmount / Math.max(0.001, heating.consumptionValue)));

  // Warm water: sqm fallback when no readings — allocate 100% of warm water cost by sqm
  const warmWaterBaseCost = warmWater.noReadings
    ? round2(warmWater.totalCost * sqmShare * tf)
    : round2(livingSpaceM2 * warmWater.baseCostRatePerM2 * tf);
  // HCA warm water rule: warm water consumption cost is 0 for HCA apartments.
  // Hot water cost allocation only applies when consumption is in kWh (Wärmezähler).
  // The warm water base cost (area-based Grundkosten) still applies.
  const warmWaterConsumptionM3 = (isHca || warmWater.noReadings) ? 0 : warmWaterDevices.reduce((s, d) => s + d.consumption, 0);
  const warmWaterConsumptionCost = (isHca || warmWater.noReadings) ? 0 : round2(
    warmWaterConsumptionM3 * (warmWater.consumptionCostAmount / Math.max(0.001, warmWater.consumptionCostVolume))
  );

  const heatingAndWarmWaterTotal = round2(
    heatingBaseCost + heatingConsumptionCost + warmWaterBaseCost + warmWaterConsumptionCost
  );

  const unitColdWaterM3 = coldWaterDevices.reduce((s, d) => s + d.consumption, 0);
  const coldWaterItems = coldWaterRateItems.map((item) => {
    // Cold water sqm fallback: use living space m² when no readings
    if (item.allocationMode === "sqm") {
      const cost = round2(livingSpaceM2 * item.rate * tf);
      return {
        label: item.label,
        volume: livingSpaceM2,
        volumeFormatted: formatGermanNumber(livingSpaceM2, 2),
        unit: item.unit,
        rate: item.rate,
        rateFormatted: item.rateFormatted,
        rateUnit: item.rateUnit,
        cost,
        costFormatted: formatEuro(cost),
      };
    }
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
    rows.map((r) => ({ ...r, location: r.location || "" }));

  const heatingTotal = heatingConsumptionValue;
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
    heatingConsumptionValue,
    heatingConsumptionValueFormatted: formatGermanNumber(heatingConsumptionValue, 2),
    heatingConsumptionUnit: cUnit,
    heatingConsumptionCost,
    heatingConsumptionCostFormatted: formatEuro(heatingConsumptionCost),
    heatingConsumptionCalc: `${formatGermanNumber(heatingConsumptionValue, 2)} ${cUnit} x ${heating.consumptionCostRatePerUnitFormatted} €/${cUnit}`,
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
