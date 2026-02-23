/**
 * Warm water energy formula per HeizKV:
 * WarmWaterEnergy = 2.5 kWh/m³/K × Volume × (60 - 10)°C / 1.15
 */
import {
  WARM_WATER_CONSTANT_FACTOR,
  WARM_WATER_TEMP_DIFF_HIGH,
  WARM_WATER_TEMP_DIFF_LOW,
  WARM_WATER_CONVERSION_FACTOR,
  DEFAULT_LIVING_SPACE_SHARE,
  DEFAULT_CONSUMPTION_DEPENDENT,
} from "./constants";
import { formatEuro, formatGermanNumber } from "@/utils";

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

function round6(v: number): number {
  return Math.round(v * 1_000_000) / 1_000_000;
}

export type WarmWaterResult = {
  constantFactor: number;
  volumeM3: number;
  volumeM3Formatted: string;
  tempDiffHigh: number;
  tempDiffLow: number;
  conversionFactor: number;
  energyKwh: number;
  energyKwhFormatted: string;
  energySharePercent: number;
  energySharePercentFormatted: string;
  costFromEnergy: number;
  costFromEnergyFormatted: string;
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
  consumptionCostVolume: number;
  consumptionCostVolumeFormatted: string;
  consumptionCostRatePerM3: number;
  consumptionCostRatePerM3Formatted: string;
};

/**
 * Compute warm water energy from volume (m³) using HeizKV formula.
 */
export function computeWarmWaterEnergy(volumeM3: number): number {
  const energy =
    (WARM_WATER_CONSTANT_FACTOR *
      volumeM3 *
      (WARM_WATER_TEMP_DIFF_HIGH - WARM_WATER_TEMP_DIFF_LOW)) /
    WARM_WATER_CONVERSION_FACTOR;
  return round2(energy);
}

/**
 * Compute full warm water cost allocation: energy share, device rental,
 * base/consumption split, rates.
 */
export function computeWarmWaterCosts(
  volumeM3: number,
  totalEnergyKwh: number,
  heatingCostTotal: number,
  deviceRental: number,
  totalLivingSpaceM2: number,
  options?: {
    baseCostPercent?: number;
    consumptionCostPercent?: number;
  }
): WarmWaterResult {
  const baseCostPercent =
    options?.baseCostPercent ?? DEFAULT_LIVING_SPACE_SHARE;
  const consumptionCostPercent =
    options?.consumptionCostPercent ?? DEFAULT_CONSUMPTION_DEPENDENT;

  const energyKwh = computeWarmWaterEnergy(volumeM3);
  const energySharePercent =
    totalEnergyKwh > 0 ? round2((energyKwh / totalEnergyKwh) * 100) : 0;
  const costFromEnergy = round2(
    (energySharePercent / 100) * heatingCostTotal
  );
  const totalCost = round2(costFromEnergy + deviceRental);

  const baseCostAmount = round2((baseCostPercent / 100) * totalCost);
  const consumptionCostAmount = round2(
    (consumptionCostPercent / 100) * totalCost
  );

  const baseCostRatePerM2 =
    totalLivingSpaceM2 > 0
      ? round6(baseCostAmount / totalLivingSpaceM2)
      : 0;
  const consumptionCostRatePerM3 =
    volumeM3 > 0 ? round6(consumptionCostAmount / volumeM3) : 0;

  return {
    constantFactor: WARM_WATER_CONSTANT_FACTOR,
    volumeM3,
    volumeM3Formatted: formatGermanNumber(volumeM3, 2),
    tempDiffHigh: WARM_WATER_TEMP_DIFF_HIGH,
    tempDiffLow: WARM_WATER_TEMP_DIFF_LOW,
    conversionFactor: WARM_WATER_CONVERSION_FACTOR,
    energyKwh,
    energyKwhFormatted: formatGermanNumber(energyKwh, 2),
    energySharePercent,
    energySharePercentFormatted: formatGermanNumber(energySharePercent, 2),
    costFromEnergy,
    costFromEnergyFormatted: formatEuro(costFromEnergy),
    deviceRental,
    deviceRentalFormatted: formatEuro(deviceRental),
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
    consumptionCostVolume: volumeM3,
    consumptionCostVolumeFormatted: formatGermanNumber(volumeM3, 2),
    consumptionCostRatePerM3,
    consumptionCostRatePerM3Formatted: formatGermanNumber(
      consumptionCostRatePerM3,
      6
    ),
  };
}
