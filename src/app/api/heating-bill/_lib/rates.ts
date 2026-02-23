/**
 * Derive EUR/m², EUR/m³, EUR/MWh rates from building-level totals.
 */
import { formatEuro, formatGermanNumber } from "@/utils";
import type { WarmWaterResult } from "./warmwater";

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

function round6(v: number): number {
  return Math.round(v * 1_000_000) / 1_000_000;
}

export type HeatingRates = {
  energyTotal: number;
  energyTotalFormatted: string;
  minusWarmWater: number;
  minusWarmWaterFormatted: string;
  deviceRental: number;
  deviceRentalFormatted: string;
  totalCost: number;
  totalCostFormatted: string;
  baseCostPercent: number;
  baseCostAmount: number;
  baseCostAmountFormatted: string;
  baseCostArea: number;
  baseCostAreaFormatted: string;
  baseCostRatePerM2: number;
  baseCostRatePerM2Formatted: string;
  consumptionCostPercent: number;
  consumptionCostAmount: number;
  consumptionCostAmountFormatted: string;
  consumptionMwh: number;
  consumptionMwhFormatted: string;
  consumptionCostRatePerMwh: number;
  consumptionCostRatePerMwhFormatted: string;
};

/**
 * Compute heating rates (after removing warm water share).
 */
export function computeHeatingRates(
  heatingCostTotal: number,
  warmWaterResult: WarmWaterResult,
  heatingDeviceRental: number,
  consumptionMwh: number,
  totalLivingSpaceM2: number,
  options?: {
    baseCostPercent?: number;
    consumptionCostPercent?: number;
  }
): HeatingRates {
  const baseCostPercent = options?.baseCostPercent ?? 30;
  const consumptionCostPercent = options?.consumptionCostPercent ?? 70;

  const minusWarmWater = warmWaterResult.costFromEnergy;
  const totalCost = round2(
    heatingCostTotal - minusWarmWater + heatingDeviceRental
  );

  const baseCostAmount = round2((baseCostPercent / 100) * totalCost);
  const consumptionCostAmount = round2(
    (consumptionCostPercent / 100) * totalCost
  );

  const baseCostRatePerM2 =
    totalLivingSpaceM2 > 0
      ? round6(baseCostAmount / totalLivingSpaceM2)
      : 0;
  const consumptionCostRatePerMwh =
    consumptionMwh > 0
      ? round6(consumptionCostAmount / consumptionMwh)
      : 0;

  return {
    energyTotal: heatingCostTotal,
    energyTotalFormatted: formatEuro(heatingCostTotal),
    minusWarmWater,
    minusWarmWaterFormatted: formatEuro(minusWarmWater),
    deviceRental: heatingDeviceRental,
    deviceRentalFormatted: formatEuro(heatingDeviceRental),
    totalCost,
    totalCostFormatted: formatEuro(totalCost),
    baseCostPercent,
    baseCostAmount,
    baseCostAmountFormatted: formatEuro(baseCostAmount),
    baseCostArea: totalLivingSpaceM2,
    baseCostAreaFormatted: formatGermanNumber(totalLivingSpaceM2, 2),
    baseCostRatePerM2,
    baseCostRatePerM2Formatted: formatGermanNumber(baseCostRatePerM2, 6),
    consumptionCostPercent,
    consumptionCostAmount,
    consumptionCostAmountFormatted: formatEuro(consumptionCostAmount),
    consumptionMwh,
    consumptionMwhFormatted: formatGermanNumber(consumptionMwh, 2),
    consumptionCostRatePerMwh,
    consumptionCostRatePerMwhFormatted: formatGermanNumber(
      consumptionCostRatePerMwh,
      6
    ),
  };
}
