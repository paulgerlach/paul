/**
 * Orchestrator: computeHeatingBill()
 * Computes building-level totals from raw data.
 * Step 1: buildingCalc from costs, warmwater, rates, readings.
 * Other sections use mock until later steps.
 */
import type { HeatingBillPdfModel } from "./types";
import { mockHeatingBillModel } from "./mock-model";
import type { HeatingBillRawData } from "./data-fetcher";
import { aggregateInvoiceCosts } from "./costs";
import { computeWarmWaterCosts } from "./warmwater";
import { computeHeatingRates } from "./rates";
import { computeReadingDeltas } from "./readings";
import { computeColdWaterRates } from "./coldwater";
import { computeUnitBreakdown } from "./unit-breakdown";
import { computeCo2Allocation } from "./co2";
import { computeEnergySummary } from "./energy-summary";
import {
  formatEuro,
  formatDateGerman,
  formatGermanNumber,
  propertyNumberFromObjekt,
  heidiCustomerNumberFromUser,
  userNumberFromIds,
  securityCodeFromIds,
} from "@/utils";

const HEAT_DEVICE_TYPES = [
  "Heat",
  "Wärmemengenzähler",
  "Heizkostenverteiler",
  "WMZ Rücklauf",
];
const WARM_WATER_DEVICE_TYPES = ["WWater", "Warmwasserzähler"];
const COLD_WATER_DEVICE_TYPES = ["Water", "Kaltwasserzähler"];
const LOGIN_ENTRY_URL = "https://heidisystems.com/";

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

/** Extract energy carrier from objekt.heating_systems (array of strings or single string). */
function energyCarrierFromObjekt(heatingSystems: unknown): string {
  if (Array.isArray(heatingSystems) && heatingSystems.length > 0) {
    const first = heatingSystems[0];
    return typeof first === "string" ? first : "Nah-/Fernwärme";
  }
  if (typeof heatingSystems === "string") return heatingSystems;
  return "Nah-/Fernwärme";
}

/**
 * Compute full HeatingBillPdfModel from raw data.
 * Step 1: buildingCalc is computed; cover, coldWater, unitBreakdown, co2, energySummary use mock.
 */
export function computeHeatingBill(
  raw: HeatingBillRawData,
  options?: { targetLocalId?: string }
): HeatingBillPdfModel {
  const model = JSON.parse(
    JSON.stringify(mockHeatingBillModel)
  ) as HeatingBillPdfModel;

  if (!raw.mainDoc || !raw.objekt) {
    return model;
  }

  const startDate = raw.mainDoc.start_date
    ? new Date(raw.mainDoc.start_date)
    : new Date();
  const endDate = raw.mainDoc.end_date
    ? new Date(raw.mainDoc.end_date)
    : new Date();

  const totalLivingSpace = raw.locals.reduce(
    (s, l) => s + Number(l.living_space ?? 0),
    0
  );

  const heatReadings = raw.meterReadings.filter((r) =>
    HEAT_DEVICE_TYPES.includes(r["Device Type"] as string)
  );
  const warmWaterReadings = raw.meterReadings.filter((r) =>
    WARM_WATER_DEVICE_TYPES.includes(r["Device Type"] as string)
  );
  const coldWaterReadings = raw.meterReadings.filter((r) =>
    COLD_WATER_DEVICE_TYPES.includes(r["Device Type"] as string)
  );

  const readingsResult = computeReadingDeltas({
    heatReadings,
    warmWaterReadings,
    coldWaterReadings,
    startDate,
    endDate,
  });

  const readingsTotalKwh = readingsResult.totalHeatKwh || 0;
  const costAgg = aggregateInvoiceCosts(
    raw.invoices as any,
    { readingsTotalKwh }
  );
  const energyTotalKwh =
    costAgg.energyInvoices.reduce((s, i) => s + i.kWh, 0) || readingsTotalKwh || 761123;

  const warmWaterVolumeM3 = readingsResult.totalWarmWaterM3 || 3148.25;
  const heatingMwh = readingsResult.totalHeatMwh || 404.04;

  const wwDeviceRental = 2307.77;
  const heatingDeviceRental = 6210.8;

  const livingSpaceShare = Number(
    raw.mainDoc.living_space_share ?? 30
  );
  const consumptionDependent = Number(
    raw.mainDoc.consumption_dependent ?? 70
  );

  const warmWater = computeWarmWaterCosts(
    warmWaterVolumeM3,
    energyTotalKwh,
    costAgg.heatingCostTotal,
    wwDeviceRental,
    totalLivingSpace || 11196.4,
    {
      baseCostPercent: livingSpaceShare,
      consumptionCostPercent: consumptionDependent,
    }
  );

  const heating = computeHeatingRates(
    costAgg.heatingCostTotal,
    warmWater,
    heatingDeviceRental,
    heatingMwh,
    totalLivingSpace || 11196.4,
    {
      baseCostPercent: livingSpaceShare,
      consumptionCostPercent: consumptionDependent,
    }
  );

  const totalColdWaterM3 = readingsResult.totalColdWaterM3 || 9943.14;
  const unitCount = raw.locals.length || 123;
  const localForDoc = raw.mainDoc.local_id
    ? raw.locals.find((l) => l.id === raw.mainDoc!.local_id)
    : null;
  const localLivingSpace = localForDoc ? Number(localForDoc.living_space ?? 0) : undefined;

  const coldWater = computeColdWaterRates(
    costAgg.coldWaterInvoices as any,
    totalColdWaterM3,
    unitCount,
    totalLivingSpace || 11196.4,
    localLivingSpace
  );

  model.coldWater = coldWater;

  // Unit breakdown: filter device rows by local and compute unit costs
  const deviceIdToLocalId = new Map<string, string>();
  for (const lm of raw.localMeters ?? []) {
    if (lm.meter_number && lm.local_id) {
      deviceIdToLocalId.set(String(lm.meter_number), lm.local_id);
    }
  }

  const targetLocalId =
    options?.targetLocalId ?? raw.mainDoc.local_id ?? raw.locals[0]?.id;
  const targetLocal = targetLocalId
    ? raw.locals.find((l) => l.id === targetLocalId)
    : raw.locals[0];
  const localLivingSpaceM2 = targetLocal ? Number(targetLocal.living_space ?? 0) : 0;
  const localLabel = targetLocal?.house_location ?? targetLocal?.floor ?? "Wohnung";

  const belongsToLocal = (deviceNumber: string) => {
    if (!targetLocalId) return true;
    const mapped = deviceIdToLocalId.get(deviceNumber);
    if (mapped !== undefined) return mapped === targetLocalId;
    return false;
  };

  const heatingDevicesForLocal = readingsResult.deviceRows.heat.filter((r) =>
    belongsToLocal(r.deviceNumber)
  );
  const warmWaterDevicesForLocal = readingsResult.deviceRows.warmWater.filter((r) =>
    belongsToLocal(r.deviceNumber)
  );
  const coldWaterDevicesForLocal = readingsResult.deviceRows.coldWater.filter((r) =>
    belongsToLocal(r.deviceNumber)
  );

  const contractsForTenantDisplay =
    raw.contractsWithContractors?.filter((c) => {
      if (targetLocalId && c.local_id !== targetLocalId) return false;
      const contractStart = new Date(c.rental_start_date);
      const contractEnd = c.rental_end_date ? new Date(c.rental_end_date) : null;
      return contractStart <= endDate && (!contractEnd || contractEnd >= startDate);
    }) ?? [];
  const contractorsNames =
    contractsForTenantDisplay
      .flatMap((c) => c.contractors)
      .map((ct) => `${ct.first_name} ${ct.last_name}`)
      .join(", ") || model.cover.contractorsNames;

  model.unitBreakdown = computeUnitBreakdown({
    localId: targetLocalId ?? "",
    livingSpaceM2: localLivingSpaceM2 || 77.02,
    localLabel: localLabel || undefined,
    heating,
    warmWater,
    coldWaterRateItems: coldWater.rateItems,
    heatingDevices: heatingDevicesForLocal,
    warmWaterDevices: warmWaterDevicesForLocal,
    coldWaterDevices: coldWaterDevicesForLocal,
    contractorsNames,
    street: raw.objekt?.street ?? model.cover.street,
    zip: raw.objekt?.zip ?? model.cover.zip,
    billingPeriodStart: formatDateGerman(raw.mainDoc.start_date) ?? "",
    billingPeriodEnd: formatDateGerman(raw.mainDoc.end_date) ?? "",
    createdAt: formatDateGerman(raw.mainDoc.created_at) ?? "",
    energyRelief: costAgg.energyRelief
      ? { label: costAgg.energyRelief.label, amount: costAgg.energyRelief.amount }
      : null,
    unitCount,
  });

  const energyCarrier = energyCarrierFromObjekt(raw.objekt?.heating_systems);
  const totalLivingSpaceM2 = totalLivingSpace || 11196.4;
  const unitHeatingMwh = heatingDevicesForLocal.reduce((s, d) => s + d.consumption, 0);
  const unitWarmWaterM3 = warmWaterDevicesForLocal.reduce((s, d) => s + d.consumption, 0);

  const portalLinkForQr = LOGIN_ENTRY_URL;

  const co2EnergyInvoices =
    costAgg.energyInvoices.filter((i) => i.kWh > 0).length > 0
      ? costAgg.energyInvoices
          .filter((i) => i.kWh > 0)
          .map((i) => ({ label: i.label, date: i.date, kWh: i.kWh }))
      : [
          {
            label: "Energieverbrauch (Zähler)",
            date: formatDateGerman(raw.mainDoc?.end_date ?? endDate.toISOString()) ?? "",
            kWh: energyTotalKwh,
          },
        ];

  model.co2 = computeCo2Allocation({
    energyInvoices: co2EnergyInvoices,
    totalLivingSpaceM2,
    energyCarrier,
    localLivingSpaceM2: localLivingSpaceM2 || 77.02,
    portalLink: portalLinkForQr,
  });

  model.energySummary = computeEnergySummary({
    energyCarrier,
    buildingTotalKwh: energyTotalKwh,
    totalLivingSpaceM2,
    unitHeatingMwh,
    unitWarmWaterM3,
    unitLivingSpaceM2: localLivingSpaceM2 || 77.02,
    portalLink: portalLinkForQr,
  });

  model.buildingCalc = {
    energyInvoices: costAgg.energyInvoices.map((i) => ({
      ...i,
      kWhFormatted:
        i.kWhFormatted ||
        formatGermanNumber(i.kWh, 3),
      amountFormatted: i.amountFormatted || formatEuro(i.amount),
    })),
    energyRelief: costAgg.energyRelief,
    energyTotalKwh: costAgg.energyInvoices.reduce((s, i) => s + i.kWh, 0),
    energyTotalKwhFormatted: formatGermanNumber(
      costAgg.energyInvoices.reduce((s, i) => s + i.kWh, 0),
      3
    ),
    energyTotalAmount: costAgg.energyTotalAmount,
    energyTotalAmountFormatted: formatEuro(costAgg.energyTotalAmount),

    heatingCostItems: costAgg.heatingCostItems.map((i) => ({
      ...i,
      amountFormatted: i.amountFormatted || formatEuro(i.amount),
    })),
    heatingCostCarryOver: costAgg.heatingCostCarryOver,
    heatingCostCarryOverFormatted: formatEuro(costAgg.heatingCostCarryOver),
    heatingCostTotal: costAgg.heatingCostTotal,
    heatingCostTotalFormatted: formatEuro(costAgg.heatingCostTotal),

    distributionCostItems: costAgg.distributionCostItems.map((i) => ({
      ...i,
      amountFormatted: i.amountFormatted || formatEuro(i.amount),
    })),
    distributionCostTotal: costAgg.distributionCostTotal,
    distributionCostTotalFormatted: formatEuro(costAgg.distributionCostTotal),
    grandTotal: costAgg.grandTotal,
    grandTotalFormatted: formatEuro(costAgg.grandTotal),

    warmWater,
    heating,
  };

  const totalContractsAmount =
    raw.contractsWithContractors?.reduce((acc, c) => {
      const overlapMonths = 12;
      return acc + overlapMonths * Number(c.additional_costs ?? 0);
    }, 0) ?? 0;
  const totalInvoicesAmount = raw.invoices.reduce(
    (s, i) => s + Number(i.total_amount ?? 0),
    0
  );
  const totalDiff = round2(totalContractsAmount - totalInvoicesAmount);

  const contractorsList = contractsForTenantDisplay.flatMap((c) => c.contractors);
  const portalLink = LOGIN_ENTRY_URL;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(portalLink)}`;

  model.cover = {
    ...model.cover,
    propertyNumber: raw.objekt?.id
      ? propertyNumberFromObjekt(raw.objekt.id)
      : model.cover.propertyNumber,
    heidiCustomerNumber: raw.user?.id
      ? heidiCustomerNumberFromUser(raw.user.id)
      : model.cover.heidiCustomerNumber,
    userNumber:
      raw.user?.id && targetLocalId && raw.mainDoc?.id
        ? userNumberFromIds(raw.user.id, targetLocalId, raw.mainDoc.id)
        : model.cover.userNumber,
    contractorsNames,
    contractors:
      contractorsList.length > 0
        ? contractorsList.map((ct) => ({
            id: ct.id,
            firstName: ct.first_name,
            lastName: ct.last_name,
          }))
        : model.cover.contractors,
    street: raw.objekt?.street ?? model.cover.street,
    zip: raw.objekt?.zip ?? model.cover.zip,
    ownerFirstName: raw.user?.first_name ?? model.cover.ownerFirstName,
    ownerLastName: raw.user?.last_name ?? model.cover.ownerLastName,
    createdAt: raw.mainDoc
      ? formatDateGerman(raw.mainDoc.created_at)
      : model.cover.createdAt,
    billingPeriodStart:
      formatDateGerman(raw.mainDoc?.start_date) ?? model.cover.billingPeriodStart,
    billingPeriodEnd:
      formatDateGerman(raw.mainDoc?.end_date) ?? model.cover.billingPeriodEnd,
    usagePeriodStart:
      formatDateGerman(raw.mainDoc?.start_date) ?? model.cover.usagePeriodStart,
    usagePeriodEnd:
      formatDateGerman(raw.mainDoc?.end_date) ?? model.cover.usagePeriodEnd,
    totalAmount: totalDiff,
    totalAmountFormatted: formatEuro(totalDiff),
    portalLink,
    userId: raw.user?.id ?? model.cover.userId,
    securityCode:
      raw.user?.id && raw.mainDoc?.id
        ? securityCodeFromIds(raw.user.id, raw.mainDoc.id)
        : model.cover.securityCode,
    qrCodeUrl,
  };

  return model;
}
