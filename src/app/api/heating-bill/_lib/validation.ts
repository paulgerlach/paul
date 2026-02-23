/**
 * Reconciliation checks: building totals == sum of unit totals.
 */
import type { HeatingBillPdfModel } from "./types";

export type ValidationResult = {
  valid: boolean;
  errors: string[];
  warnings: string[];
};

const EPSILON = 0.02; // 2 cents tolerance for currency

function approxEqual(a: number, b: number, tol = EPSILON): boolean {
  return Math.abs(a - b) <= tol;
}

export function validateModel(model: HeatingBillPdfModel): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const bc = model.buildingCalc;

  // Energy + distribution == grand total
  const computedGrandTotal = bc.heatingCostTotal + bc.distributionCostTotal;
  if (!approxEqual(computedGrandTotal, bc.grandTotal)) {
    errors.push(
      `Grand total mismatch: heatingCostTotal (${bc.heatingCostTotal}) + distributionCostTotal (${bc.distributionCostTotal}) = ${computedGrandTotal}, expected ${bc.grandTotal}`
    );
  }

  // Warm water: costFromEnergy + deviceRental == totalCost
  const wwComputed = bc.warmWater.costFromEnergy + bc.warmWater.deviceRental;
  if (!approxEqual(wwComputed, bc.warmWater.totalCost)) {
    errors.push(
      `Warm water total mismatch: costFromEnergy + deviceRental = ${wwComputed}, expected ${bc.warmWater.totalCost}`
    );
  }

  // Heating: energyTotal - minusWarmWater + deviceRental == totalCost
  const hComputed =
    bc.heating.energyTotal - bc.heating.minusWarmWater + bc.heating.deviceRental;
  if (!approxEqual(hComputed, bc.heating.totalCost)) {
    errors.push(
      `Heating total mismatch: energyTotal - minusWarmWater + deviceRental = ${hComputed}, expected ${bc.heating.totalCost}`
    );
  }

  // Base + consumption percentages
  if (
    bc.warmWater.baseCostPercent + bc.warmWater.consumptionCostPercent !== 100
  ) {
    warnings.push(
      `Warm water base+consumption = ${bc.warmWater.baseCostPercent + bc.warmWater.consumptionCostPercent}%, expected 100%`
    );
  }

  if (
    bc.heating.baseCostPercent + bc.heating.consumptionCostPercent !== 100
  ) {
    warnings.push(
      `Heating base+consumption = ${bc.heating.baseCostPercent + bc.heating.consumptionCostPercent}%, expected 100%`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
