/** Every value the PDF needs. No computation in PDF components. */
export interface HeatingBillPdfModel {
  // --- Page 1: Cover ---
  cover: {
    propertyNumber: string;
    heidiCustomerNumber: string;
    userNumber: string;
    contractorsNames: string;
    /** For contractor grid on Page 1 - optional, falls back to contractorsNames */
    contractors?: Array<{ id: string; firstName: string; lastName: string }>;
    street: string;
    zip: string;
    ownerFirstName: string;
    ownerLastName: string;
    createdAt: string;
    billingPeriodStart: string;
    billingPeriodEnd: string;
    usagePeriodStart: string;
    usagePeriodEnd: string;
    totalAmount: number;
    totalAmountFormatted: string;
    portalLink: string;
    userId: string;
    securityCode: string;
    qrCodeUrl: string;
  };

  // --- Page 2: Building-Level Calculation ---
  buildingCalc: {
    energyInvoices: Array<{
      label: string;
      date: string;
      kWh: number;
      kWhFormatted: string;
      amount: number;
      amountFormatted: string;
    }>;
    energyRelief: { label: string; amount: number; amountFormatted: string } | null;
    energyTotalKwh: number;
    energyTotalKwhFormatted: string;
    energyTotalAmount: number;
    energyTotalAmountFormatted: string;

    heatingCostItems: Array<{
      label: string;
      date: string;
      amount: number;
      amountFormatted: string;
    }>;
    heatingCostCarryOver: number;
    heatingCostCarryOverFormatted: string;
    heatingCostTotal: number;
    heatingCostTotalFormatted: string;

    distributionCostItems: Array<{
      label: string;
      amount: number;
      amountFormatted: string;
    }>;
    distributionCostTotal: number;
    distributionCostTotalFormatted: string;
    grandTotal: number;
    grandTotalFormatted: string;

    warmWater: {
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

    heating: {
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
  };

  // --- Page 3: Cold Water Rates ---
  coldWater: {
    totalCost: number;
    totalCostFormatted: string;
    rateItems: Array<{
      label: string;
      totalCost: number;
      totalCostFormatted: string;
      totalVolume: number;
      totalVolumeFormatted: string;
      unit: string;
      rate: number;
      rateFormatted: string;
      rateUnit: string;
    }>;
    unitTotalCost: number;
    unitTotalCostFormatted: string;
  };

  // --- Page 4: Unit-Level Breakdown ---
  unitBreakdown: {
    contractorsNames: string;
    street: string;
    zip: string;
    billingPeriodStart: string;
    billingPeriodEnd: string;
    createdAt: string;

    livingSpaceM2: number;
    livingSpaceM2Formatted: string;

    heatingBaseCost: number;
    heatingBaseCostFormatted: string;
    heatingBaseCostCalc: string;
    heatingConsumptionMwh: number;
    heatingConsumptionMwhFormatted: string;
    heatingConsumptionCost: number;
    heatingConsumptionCostFormatted: string;
    heatingConsumptionCalc: string;

    warmWaterBaseCost: number;
    warmWaterBaseCostFormatted: string;
    warmWaterBaseCostCalc: string;
    warmWaterConsumptionM3: number;
    warmWaterConsumptionM3Formatted: string;
    warmWaterConsumptionCost: number;
    warmWaterConsumptionCostFormatted: string;
    warmWaterConsumptionCalc: string;
    heatingAndWarmWaterTotal: number;
    heatingAndWarmWaterTotalFormatted: string;

    coldWaterItems: Array<{
      label: string;
      volume: number;
      volumeFormatted: string;
      unit: string;
      rate: number;
      rateFormatted: string;
      rateUnit: string;
      cost: number;
      costFormatted: string;
    }>;
    coldWaterTotal: number;
    coldWaterTotalFormatted: string;

    grandTotal: number;
    grandTotalFormatted: string;

    stateRelief: {
      label: string;
      buildingTotal: number;
      buildingTotalFormatted: string;
      unitShare: number;
      unitShareFormatted: string;
    } | null;

    heatingDevices: DeviceReadingRow[];
    warmWaterDevices: DeviceReadingRow[];
    coldWaterDevices: DeviceReadingRow[];
    heatingDevicesTotal: number;
    heatingDevicesTotalFormatted: string;
    warmWaterDevicesTotal: number;
    warmWaterDevicesTotalFormatted: string;
    coldWaterDevicesTotal: number;
    coldWaterDevicesTotalFormatted: string;
  };

  // --- Page 5: CO2 Allocation ---
  co2: {
    energyRows: Array<{
      label: string;
      date: string;
      kWh: number;
      kWhFormatted: string;
      co2Kg: number;
      co2KgFormatted: string;
      cost: number;
      costFormatted: string;
    }>;
    totalKwh: number;
    totalKwhFormatted: string;
    totalCo2Kg: number;
    totalCo2KgFormatted: string;
    totalCost: number;
    totalCostFormatted: string;

    totalLivingSpaceM2: number;
    totalLivingSpaceM2Formatted: string;
    emissionFactorKgPerKwh: number;
    emissionFactorFormatted: string;
    emissionPerM2: number;
    emissionPerM2Formatted: string;

    classificationTable: Array<{
      rangeLabel: string;
      tenantPercent: number;
      landlordPercent: number;
      isHighlighted: boolean;
    }>;
    selectedTierTenantPercent: number;
    selectedTierLandlordPercent: number;

    buildingTenantCost: number;
    buildingTenantCostFormatted: string;
    buildingLandlordCost: number;
    buildingLandlordCostFormatted: string;
    buildingTotalCost: number;
    buildingTotalCostFormatted: string;
    unitTenantCost: number;
    unitTenantCostFormatted: string;
    unitLandlordCost: number;
    unitLandlordCostFormatted: string;
    unitTotalCost: number;
    unitTotalCostFormatted: string;

    qrCodeUrl: string;
    infoLink: string;
  };

  // --- Page 6: Energy Summary ---
  energySummary: {
    energyCarrier: string;
    totalKwh: number;
    totalKwhFormatted: string;
    co2EmissionFactor: number;
    co2EmissionFactorFormatted: string;
    primaryEnergyFactors: Array<{ label: string; value: number; valueFormatted: string }>;
    totalCo2Kg: number;
    totalCo2KgFormatted: string;

    heatingKwh: number;
    heatingKwhFormatted: string;
    warmWaterKwh: number;
    warmWaterKwhFormatted: string;
    totalUnitKwh: number;
    totalUnitKwhFormatted: string;
    livingSpaceM2: number;
    livingSpaceM2Formatted: string;
    kwhPerM2: number;
    kwhPerM2Formatted: string;

    nationalAverageKwhPerM2: number;
    nationalAverageFormatted: string;
    propertyAverageKwhPerM2: number;
    propertyAverageFormatted: string;

    qrCodeUrl: string;
    infoLink: string;
    energyAgencyLink: string;
  };
}

export interface DeviceReadingRow {
  deviceNumber: string;
  deviceType: string;
  location: string;
  startReading: number;
  startReadingFormatted: string;
  endReading: number;
  endReadingFormatted: string;
  consumption: number;
  consumptionFormatted: string;
  unit: string;
}
