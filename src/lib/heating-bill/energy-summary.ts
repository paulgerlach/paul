/**
 * Energy summary for Page 6 (Energieverbrauch).
 */
import type { HeatingBillPdfModel } from "./types";
import { CO2_EMISSION_FACTORS, NATIONAL_AVERAGE_KWH_PER_M2 } from "./constants";
import { computeWarmWaterEnergy } from "./warmwater";
import { formatGermanNumber } from "@/utils";

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

function getEmissionFactor(energyCarrier: string): number {
  const key = energyCarrier?.trim() || "default";
  return CO2_EMISSION_FACTORS[key] ?? CO2_EMISSION_FACTORS.default;
}

/** Primary energy factors from DIN V 18599 for common carriers */
const PRIMARY_ENERGY_FACTORS: Array<{ label: string; value: number }> = [
  { label: "Heizwerke und fossile Brennstoffe", value: 1.3 },
];

export type EnergySummaryInput = {
  energyCarrier: string;
  buildingTotalKwh: number;
  totalLivingSpaceM2: number;
  /** Unit heating consumption in MWh (from unit breakdown) */
  unitHeatingMwh: number;
  /** Unit warm water consumption in m³ */
  unitWarmWaterM3: number;
  unitLivingSpaceM2: number;
  portalLink: string;
};

/**
 * Compute energy summary for Page 6.
 */
export function computeEnergySummary(
  input: EnergySummaryInput
): HeatingBillPdfModel["energySummary"] {
  const {
    energyCarrier,
    buildingTotalKwh,
    totalLivingSpaceM2,
    unitHeatingMwh,
    unitWarmWaterM3,
    unitLivingSpaceM2,
    portalLink,
  } = input;

  const factor = getEmissionFactor(energyCarrier);
  const totalCo2Kg = round2(buildingTotalKwh * factor);

  const heatingKwh = round2(unitHeatingMwh * 1000);
  const warmWaterKwh = round2(computeWarmWaterEnergy(unitWarmWaterM3));
  const totalUnitKwh = round2(heatingKwh + warmWaterKwh);

  const kwhPerM2 =
    unitLivingSpaceM2 > 0
      ? round2(totalUnitKwh / unitLivingSpaceM2)
      : 0;

  const propertyAverageKwhPerM2 =
    totalLivingSpaceM2 > 0
      ? round2(buildingTotalKwh / totalLivingSpaceM2)
      : 0;

  const primaryEnergyFactors = PRIMARY_ENERGY_FACTORS.map((f) => ({
    label: f.label,
    value: f.value,
    valueFormatted: formatGermanNumber(f.value, 2),
  }));

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(portalLink)}`;

  return {
    energyCarrier: energyCarrier || "Nah-/Fernwärme",
    totalKwh: buildingTotalKwh,
    totalKwhFormatted: formatGermanNumber(buildingTotalKwh, 1),
    co2EmissionFactor: factor,
    co2EmissionFactorFormatted: formatGermanNumber(factor, 5),
    primaryEnergyFactors,
    totalCo2Kg,
    totalCo2KgFormatted: formatGermanNumber(totalCo2Kg, 2),

    heatingKwh,
    heatingKwhFormatted: formatGermanNumber(heatingKwh, 1),
    warmWaterKwh,
    warmWaterKwhFormatted: formatGermanNumber(warmWaterKwh, 2),
    totalUnitKwh,
    totalUnitKwhFormatted: formatGermanNumber(totalUnitKwh, 2),
    livingSpaceM2: unitLivingSpaceM2,
    livingSpaceM2Formatted: formatGermanNumber(unitLivingSpaceM2, 2),
    kwhPerM2,
    kwhPerM2Formatted: formatGermanNumber(kwhPerM2, 2),

    nationalAverageKwhPerM2: NATIONAL_AVERAGE_KWH_PER_M2,
    nationalAverageFormatted: formatGermanNumber(NATIONAL_AVERAGE_KWH_PER_M2, 1),
    propertyAverageKwhPerM2,
    propertyAverageFormatted: formatGermanNumber(propertyAverageKwhPerM2, 2),

    qrCodeUrl,
    infoLink: "https://heidi.systems/energy",
    energyAgencyLink: "https://www.deutschland-machts-effizient.de",
  };
}
