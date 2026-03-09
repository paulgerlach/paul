/**
 * CO2 allocation for Page 5 (CO2KostAufG).
 */
import type { HeatingBillPdfModel } from "./types";
import { CO2_TIER_TABLE, CO2_EMISSION_FACTORS } from "./constants";
import { formatEuro, formatGermanNumber } from "@/utils";

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

function getEmissionFactor(energyCarrier: string): number {
  const key = energyCarrier?.trim() || "default";
  return CO2_EMISSION_FACTORS[key] ?? CO2_EMISSION_FACTORS.default;
}

export type CO2Input = {
  energyInvoices: Array<{ label: string; date: string; kWh: number; co2PricePerTonne?: number | null }>;
  totalLivingSpaceM2: number;
  energyCarrier: string;
  localLivingSpaceM2: number;
  portalLink: string;
};

/**
 * Compute CO2 allocation for Page 5.
 */
export function computeCo2Allocation(input: CO2Input): HeatingBillPdfModel["co2"] {
  const {
    energyInvoices,
    totalLivingSpaceM2,
    energyCarrier,
    localLivingSpaceM2,
    portalLink,
  } = input;

  const factor = getEmissionFactor(energyCarrier);
  const totalKwh = energyInvoices.reduce((s, i) => s + i.kWh, 0);
  const totalCo2Kg = round2(totalKwh * factor);

  const energyRows = energyInvoices.map((i) => {
    const co2Kg = round2(i.kWh * factor);
    const cost = round2((co2Kg / 1000) * (i.co2PricePerTonne ?? 0));
    return {
      label: i.label,
      date: i.date,
      kWh: i.kWh,
      kWhFormatted: formatGermanNumber(i.kWh, 3),
      co2Kg,
      co2KgFormatted: formatGermanNumber(co2Kg, 2),
      cost,
      costFormatted: formatEuro(cost),
    };
  });

  const totalCost = round2(energyRows.reduce((s, r) => s + r.cost, 0));

  const emissionPerM2 =
    totalLivingSpaceM2 > 0
      ? round2(totalCo2Kg / totalLivingSpaceM2)
      : 0;

  const selectedTier = CO2_TIER_TABLE.find(
    (t) => emissionPerM2 >= t.minEmissionPerM2 && emissionPerM2 < t.maxEmissionPerM2
  ) ?? CO2_TIER_TABLE[CO2_TIER_TABLE.length - 1];

  const classificationTable = CO2_TIER_TABLE.map((t) => {
    const rangeLabel =
      t.minEmissionPerM2 === 0
        ? `< ${t.maxEmissionPerM2} kg CO₂/m²/a`
        : t.maxEmissionPerM2 === Infinity
          ? `≥ ${t.minEmissionPerM2} kg CO₂/m²/a`
          : `${t.minEmissionPerM2} bis < ${t.maxEmissionPerM2} kg CO₂/m²/a`;
    return {
      rangeLabel,
      tenantPercent: t.tenantPercent,
      landlordPercent: t.landlordPercent,
      isHighlighted:
        t.minEmissionPerM2 === selectedTier.minEmissionPerM2 &&
        t.maxEmissionPerM2 === selectedTier.maxEmissionPerM2,
    };
  });

  const buildingTotalCost = totalCost;
  const buildingTenantCost = round2(buildingTotalCost * 0.5);
  const buildingLandlordCost = round2(buildingTotalCost * 0.5);

  const spaceShare =
    totalLivingSpaceM2 > 0 && localLivingSpaceM2 > 0
      ? localLivingSpaceM2 / totalLivingSpaceM2
      : 0;
  const unitTenantCost = round2(buildingTenantCost * spaceShare);
  const unitLandlordCost = round2(buildingLandlordCost * spaceShare);
  const unitTotalCost = round2(unitTenantCost + unitLandlordCost);

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(portalLink)}`;

  return {
    energyCarrier: energyCarrier || "Nah-/Fernwärme",
    energyRows,
    totalKwh,
    totalKwhFormatted: formatGermanNumber(totalKwh, 3),
    totalCo2Kg,
    totalCo2KgFormatted: formatGermanNumber(totalCo2Kg, 2),
    totalCost,
    totalCostFormatted: formatEuro(totalCost),

    totalLivingSpaceM2,
    totalLivingSpaceM2Formatted: formatGermanNumber(totalLivingSpaceM2, 2),
    emissionFactorKgPerKwh: factor,
    emissionFactorFormatted: formatGermanNumber(factor, 5),
    emissionPerM2,
    emissionPerM2Formatted: formatGermanNumber(emissionPerM2, 2),

    classificationTable,
    selectedTierTenantPercent: selectedTier.tenantPercent,
    selectedTierLandlordPercent: selectedTier.landlordPercent,

    buildingTenantCost,
    buildingTenantCostFormatted: formatEuro(buildingTenantCost),
    buildingLandlordCost,
    buildingLandlordCostFormatted: formatEuro(buildingLandlordCost),
    buildingTotalCost,
    buildingTotalCostFormatted: formatEuro(buildingTotalCost),
    unitTenantCost,
    unitTenantCostFormatted: formatEuro(unitTenantCost),
    unitLandlordCost,
    unitLandlordCostFormatted: formatEuro(unitLandlordCost),
    unitTotalCost,
    unitTotalCostFormatted: formatEuro(unitTotalCost),

    qrCodeUrl,
    infoLink: "https://heidi.systems/co2",
  };
}
