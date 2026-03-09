/**
 * Orchestrator: computeHeatingBill()
 * Computes building-level totals from raw data.
 * Step 1: buildingCalc from costs, warmwater, rates, readings.
 * Other sections use mock until later steps.
 */
import type { HeatingBillPdfModel } from "./types";
import { emptyHeatingBillModel } from "./empty-model";
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
import { getHkvoFactor } from "./constants";

const HEAT_DEVICE_TYPES = [
  "Heat",
  "Wärmemengenzähler",
  "WMZ Rücklauf",
];
const HCA_DEVICE_TYPES = [
  "HCA",
  "Heizkostenverteiler",
];
const WARM_WATER_DEVICE_TYPES = ["WWater", "Warmwasserzähler"];
const COLD_WATER_DEVICE_TYPES = ["Water", "Kaltwasserzähler"];
const LOGIN_ENTRY_URL = "https://heidisystems.com/";

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

function normalizeDeviceId(id: string | null | undefined): string {
  return String(id ?? "").trim().replace(/^0+/, "");
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

export type TenantOverride = {
  contractId: string;
  contractorsNames: string;
  timeFraction: number;
  overlapStart: Date;
  overlapEnd: Date;
  usagePeriodStart: string;
  usagePeriodEnd: string;
};

/**
 * Compute full HeatingBillPdfModel from raw data.
 * When tenantOverride is provided, unit-level readings are scoped to the
 * tenant's contract overlap period, and base/invoice costs are prorated
 * by the time fraction.
 */
export function computeHeatingBill(
  raw: HeatingBillRawData,
  options?: { targetLocalId?: string; tenantOverride?: TenantOverride }
): HeatingBillPdfModel {
  const model = JSON.parse(
    JSON.stringify(emptyHeatingBillModel)
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
  const hcaReadings = raw.meterReadings.filter((r) =>
    HCA_DEVICE_TYPES.includes(r["Device Type"] as string)
  );
  const warmWaterReadings = raw.meterReadings.filter((r) =>
    WARM_WATER_DEVICE_TYPES.includes(r["Device Type"] as string)
  );
  const coldWaterReadings = raw.meterReadings.filter((r) =>
    COLD_WATER_DEVICE_TYPES.includes(r["Device Type"] as string)
  );

  // Determine building consumption unit based on device types present
  const hasHca = hcaReadings.length > 0;
  const consumptionUnit = hasHca ? "Nutzeinh." : "MWh";

  const readingsResult = computeReadingDeltas({
    heatReadings,
    hcaReadings,
    warmWaterReadings,
    coldWaterReadings,
    startDate,
    endDate,
  });

  const readingsTotalKwh = readingsResult.totalHeatKwh || 0;

  const targetLocalId =
    options?.targetLocalId ?? raw.mainDoc.local_id ?? raw.locals[0]?.id;

  // Filter invoices by locale scope:
  // - for_all_tenants === true (or null/undefined): include for all locales
  // - for_all_tenants === false: only include if targetLocalId is in direct_local_id array
  const filteredInvoices = raw.invoices.filter((inv) => {
    if (inv.for_all_tenants !== false) return true;
    if (!targetLocalId) return true; // no target = include everything
    const linkedLocals = inv.direct_local_id ?? [];
    return linkedLocals.includes(targetLocalId);
  });

  const costAgg = aggregateInvoiceCosts(
    filteredInvoices as any,
    { readingsTotalKwh }
  );
  const energyTotalKwh =
    costAgg.energyInvoices.reduce((s, i) => s + i.kWh, 0) || readingsTotalKwh || 0;

  const warmWaterVolumeM3 = readingsResult.totalWarmWaterM3 || 0;
  // Use HCA units when HCA devices are present, otherwise use MWh from heat meters
  const heatingConsumptionValue = hasHca
    ? readingsResult.totalHcaUnits
    : readingsResult.totalHeatMwh;
  const heatingMwh = heatingConsumptionValue;

  const wwDeviceRental = costAgg.wwDeviceRentalTotal || 0;
  const heatingDeviceRental = costAgg.heatingDeviceRentalTotal || 0;

  const livingSpaceShare = Number(
    raw.mainDoc.living_space_share ?? 30
  );
  const consumptionDependent = Number(
    raw.mainDoc.consumption_dependent ?? 70
  );

  // Resolve energy carrier: prefer the fuel cost invoice's purpose (user-selected option
  // like "Erdgas (Brennwert)"), fall back to objekt.heating_systems
  const fuelInvoice = filteredInvoices.find((inv) => {
    const ct = (inv.cost_type ?? "").toLowerCase().replace(/\s/g, "_");
    return ct === "fuel_costs" || ct === "brennstoffkosten";
  });
  const energyCarrier =
    fuelInvoice?.purpose?.trim() ||
    energyCarrierFromObjekt(raw.objekt?.heating_systems);
  const hkvoFactor = getHkvoFactor(energyCarrier);

  const warmWater = computeWarmWaterCosts(
    warmWaterVolumeM3,
    energyTotalKwh,
    costAgg.heatingCostTotal,
    wwDeviceRental,
    totalLivingSpace || 0,
    {
      baseCostPercent: livingSpaceShare,
      consumptionCostPercent: consumptionDependent,
      hkvoFactor,
    }
  );

  const heating = computeHeatingRates(
    costAgg.heatingCostTotal,
    warmWater,
    heatingDeviceRental,
    heatingMwh,
    totalLivingSpace || 0,
    {
      baseCostPercent: livingSpaceShare,
      consumptionCostPercent: consumptionDependent,
      consumptionUnit,
    }
  );

  const totalColdWaterM3 = readingsResult.totalColdWaterM3 || 0;
  const unitCount = raw.locals.length || 1;
  const localForDoc = raw.mainDoc.local_id
    ? raw.locals.find((l) => l.id === raw.mainDoc!.local_id)
    : null;
  const localLivingSpace = localForDoc ? Number(localForDoc.living_space ?? 0) : undefined;

  const coldWater = computeColdWaterRates(
    costAgg.coldWaterInvoices as any,
    totalColdWaterM3,
    unitCount,
    totalLivingSpace || 0,
    localLivingSpace
  );

  model.coldWater = coldWater;

  // Unit breakdown: filter device rows by local and compute unit costs
  const deviceIdToLocalId = new Map<string, string>();
  const deviceIdToMeterNote = new Map<string, string>();
  for (const lm of raw.localMeters ?? []) {
    if (lm.meter_number && lm.local_id) {
      const normalizedMeterId = normalizeDeviceId(lm.meter_number);
      if (normalizedMeterId) {
        deviceIdToLocalId.set(normalizedMeterId, lm.local_id);
      }
    }
    if (lm.meter_number && lm.meter_note) {
      const normalizedMeterId = normalizeDeviceId(lm.meter_number);
      if (normalizedMeterId) {
        deviceIdToMeterNote.set(normalizedMeterId, lm.meter_note);
      }
    }
  }

  const withMeterNote = <T extends { deviceNumber: string; location: string }>(r: T): T => {
    const note = deviceIdToMeterNote.get(normalizeDeviceId(r.deviceNumber));
    return note ? { ...r, location: note } : r;
  };

  const targetLocal = targetLocalId
    ? raw.locals.find((l) => l.id === targetLocalId)
    : raw.locals[0];
  const localLivingSpaceM2 = targetLocal ? Number(targetLocal.living_space ?? 0) : 0;

  const belongsToLocal = (deviceNumber: string) => {
    if (!targetLocalId) return true;
    const normalizedDeviceNumber = normalizeDeviceId(deviceNumber);
    if (!normalizedDeviceNumber) return false;
    const mapped = deviceIdToLocalId.get(normalizedDeviceNumber);
    if (mapped !== undefined) return mapped === targetLocalId;
    return false;
  };

  // When tenantOverride is provided, re-compute readings scoped to the tenant's
  // overlap period so consumption values reflect only that tenant's occupancy.
  const tenantOverride = options?.tenantOverride;
  const unitReadingsResult = tenantOverride
    ? computeReadingDeltas({
      heatReadings,
      hcaReadings,
      warmWaterReadings,
      coldWaterReadings,
      startDate: tenantOverride.overlapStart,
      endDate: tenantOverride.overlapEnd,
    })
    : readingsResult;

  // Merge heat + HCA device rows for the target local
  const heatingDevicesForLocal = [
    ...unitReadingsResult.deviceRows.heat.filter((r) =>
      belongsToLocal(r.deviceNumber)
    ).map(withMeterNote),
    ...unitReadingsResult.deviceRows.hca.filter((r) =>
      belongsToLocal(r.deviceNumber)
    ).map(withMeterNote),
  ];
  const warmWaterDevicesForLocal = unitReadingsResult.deviceRows.warmWater.filter((r) =>
    belongsToLocal(r.deviceNumber)
  ).map(withMeterNote);
  const coldWaterDevicesForLocal = unitReadingsResult.deviceRows.coldWater.filter((r) =>
    belongsToLocal(r.deviceNumber)
  ).map(withMeterNote);
  // Diagnostic logging: always log device pipeline counts for troubleshooting
  const allDeviceRowCount =
    unitReadingsResult.deviceRows.heat.length +
    unitReadingsResult.deviceRows.hca.length +
    unitReadingsResult.deviceRows.warmWater.length +
    unitReadingsResult.deviceRows.coldWater.length;
  const localDeviceRowCount =
    heatingDevicesForLocal.length +
    warmWaterDevicesForLocal.length +
    coldWaterDevicesForLocal.length;

  if ((raw.localMeters?.length ?? 0) > 0 && deviceIdToLocalId.size === 0) {
    console.warn("[HeatingBill] local meter mapping is empty after normalization", {
      localMetersCount: raw.localMeters.length,
      targetLocalId: targetLocalId ?? null,
    });
  }
  if (allDeviceRowCount > 0 && localDeviceRowCount === 0 && targetLocalId) {
    // Log unmatched devices to identify why filtering dropped everything
    const unmatchedDevices = [
      ...unitReadingsResult.deviceRows.heat,
      ...unitReadingsResult.deviceRows.hca,
      ...unitReadingsResult.deviceRows.warmWater,
      ...unitReadingsResult.deviceRows.coldWater,
    ].map((r) => ({
      deviceNumber: r.deviceNumber,
      normalizedId: normalizeDeviceId(r.deviceNumber),
      mappedLocalId: deviceIdToLocalId.get(normalizeDeviceId(r.deviceNumber)) ?? "NOT_FOUND",
    }));
    console.warn("[HeatingBill] no device rows matched target local after filtering", {
      targetLocalId,
      allHeatDevices: unitReadingsResult.deviceRows.heat.length,
      allHcaDevices: unitReadingsResult.deviceRows.hca.length,
      allWarmWaterDevices: unitReadingsResult.deviceRows.warmWater.length,
      allColdWaterDevices: unitReadingsResult.deviceRows.coldWater.length,
      localHeatDevices: heatingDevicesForLocal.length,
      localWarmWaterDevices: warmWaterDevicesForLocal.length,
      localColdWaterDevices: coldWaterDevicesForLocal.length,
      mappedMeters: deviceIdToLocalId.size,
      unmatchedDevices: unmatchedDevices.slice(0, 10), // limit to 10 for log readability
    });
  }
  // Log device type distribution from raw readings for debugging
  if (raw.meterReadings.length > 0 && allDeviceRowCount === 0) {
    const typeCounts: Record<string, number> = {};
    for (const r of raw.meterReadings) {
      const dt = String(r["Device Type"] ?? "unknown");
      typeCounts[dt] = (typeCounts[dt] ?? 0) + 1;
    }
    console.warn("[HeatingBill] RPC returned readings but no device rows were produced", {
      totalReadings: raw.meterReadings.length,
      deviceTypeCounts: typeCounts,
      heatTypeFilter: HEAT_DEVICE_TYPES,
      warmWaterTypeFilter: WARM_WATER_DEVICE_TYPES,
      coldWaterTypeFilter: COLD_WATER_DEVICE_TYPES,
    });
  }

  // Tenant override replaces contractor name resolution
  const contractorsNames = tenantOverride
    ? tenantOverride.contractorsNames
    : (() => {
      const contractsForTenantDisplay =
        raw.contractsWithContractors?.filter((c) => {
          if (targetLocalId && c.local_id !== targetLocalId) return false;
          const contractStart = new Date(c.rental_start_date);
          const contractEnd = c.rental_end_date ? new Date(c.rental_end_date) : null;
          return contractStart <= endDate && (!contractEnd || contractEnd >= startDate);
        }) ?? [];
      return (
        contractsForTenantDisplay
          .flatMap((c) => c.contractors)
          .map((ct) => `${ct.first_name} ${ct.last_name}`)
          .join(", ") || ""
      );
    })();

  model.unitBreakdown = computeUnitBreakdown({
    localId: targetLocalId ?? "",
    livingSpaceM2: localLivingSpaceM2 || 0,
    totalLivingSpaceM2: totalLivingSpace || 0,
    heating,
    warmWater,
    coldWaterRateItems: coldWater.rateItems,
    heatingDevices: heatingDevicesForLocal,
    warmWaterDevices: warmWaterDevicesForLocal,
    coldWaterDevices: coldWaterDevicesForLocal,
    contractorsNames,
    street: raw.objekt?.street ?? "",
    zip: raw.objekt?.zip ?? "",
    billingPeriodStart: formatDateGerman(raw.mainDoc.start_date) ?? "",
    billingPeriodEnd: formatDateGerman(raw.mainDoc.end_date) ?? "",
    createdAt: formatDateGerman(raw.mainDoc.created_at) ?? "",
    energyRelief: costAgg.energyRelief
      ? { label: costAgg.energyRelief.label, amount: costAgg.energyRelief.amount }
      : null,
    unitCount,
    timeFraction: tenantOverride?.timeFraction,
    consumptionUnit,
  });


  const totalLivingSpaceM2 = totalLivingSpace || 0;
  // For HCA buildings, heating consumption is in Einheiten, not MWh.
  // Pass 0 for energy summary to avoid distorted kWh/m² metrics.
  const unitHeatingMwh = hasHca
    ? 0
    : heatingDevicesForLocal.reduce((s, d) => s + d.consumption, 0);
  const unitWarmWaterM3 = warmWaterDevicesForLocal.reduce((s, d) => s + d.consumption, 0);

  const portalLinkForQr = LOGIN_ENTRY_URL;

  const co2EnergyInvoices =
    costAgg.energyInvoices.filter((i) => i.kWh > 0).length > 0
      ? costAgg.energyInvoices
        .filter((i) => i.kWh > 0)
        .map((i) => ({ label: i.label, date: i.date, kWh: i.kWh, co2PricePerTonne: i.co2PricePerTonne }))
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
    localLivingSpaceM2: localLivingSpaceM2 || 0,
    portalLink: portalLinkForQr,
  });

  model.energySummary = computeEnergySummary({
    energyCarrier,
    buildingTotalKwh: energyTotalKwh,
    totalLivingSpaceM2,
    unitHeatingMwh,
    unitWarmWaterM3,
    unitLivingSpaceM2: localLivingSpaceM2 || 0,
    portalLink: portalLinkForQr,
  });

  model.buildingCalc = {
    energyCarrier,
    energyInvoices: costAgg.energyInvoices.map((i) => ({
      ...i,
      kWhFormatted:
        i.kWhFormatted ||
        (i.kWh > 0 ? formatGermanNumber(i.kWh, 3) : ""),
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

  const portalLink = LOGIN_ENTRY_URL;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(portalLink)}`;

  // Build contractors list for cover page (empty for tenant override)
  const contractorsList = tenantOverride
    ? []
    : (raw.contractsWithContractors?.filter((c) => {
      if (targetLocalId && c.local_id !== targetLocalId) return false;
      const cStart = new Date(c.rental_start_date);
      const cEnd = c.rental_end_date ? new Date(c.rental_end_date) : null;
      return cStart <= endDate && (!cEnd || cEnd >= startDate);
    }) ?? []).flatMap((c) => c.contractors);

  model.cover = {
    ...model.cover,
    propertyNumber: raw.objekt?.id
      ? propertyNumberFromObjekt(raw.objekt.id)
      : "",
    heidiCustomerNumber: raw.user?.id
      ? heidiCustomerNumberFromUser(raw.user.id)
      : "",
    userNumber:
      raw.user?.id && targetLocalId && raw.mainDoc?.id
        ? userNumberFromIds(raw.user.id, targetLocalId, raw.mainDoc.id)
        : "",
    contractorsNames,
    contractors:
      contractorsList.length > 0
        ? contractorsList.map((ct) => ({
          id: ct.id,
          firstName: ct.first_name,
          lastName: ct.last_name,
        }))
        : [],
    street: raw.objekt?.street ?? "",
    zip: raw.objekt?.zip ?? "",
    ownerFirstName: raw.objektOwner?.first_name ?? "",
    ownerLastName: raw.objektOwner?.last_name ?? "",
    createdAt: raw.mainDoc
      ? formatDateGerman(raw.mainDoc.created_at) ?? ""
      : "",
    billingPeriodStart:
      formatDateGerman(raw.mainDoc?.start_date) ?? "",
    billingPeriodEnd:
      formatDateGerman(raw.mainDoc?.end_date) ?? "",
    usagePeriodStart:
      tenantOverride?.usagePeriodStart ??
      formatDateGerman(raw.mainDoc?.start_date) ?? "",
    usagePeriodEnd:
      tenantOverride?.usagePeriodEnd ??
      formatDateGerman(raw.mainDoc?.end_date) ?? "",
    totalAmount: model.unitBreakdown.grandTotal,
    totalAmountFormatted: model.unitBreakdown.grandTotalFormatted,
    portalLink,
    userId: raw.user?.id ?? "",
    securityCode:
      raw.user?.id && raw.mainDoc?.id
        ? securityCodeFromIds(raw.user.id, raw.mainDoc.id)
        : "",
    qrCodeUrl,
  };

  return model;
}
