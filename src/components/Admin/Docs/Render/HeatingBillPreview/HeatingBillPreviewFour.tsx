"use client";

import { type HeatingBillPreviewData } from "./types";
import { useMemo } from "react";
import { useConsumptionData } from "@/hooks/useConsumptionData";

import { HeatingBillPreviewFourView } from "./HeatingBillPreviewFourView";
import { ENERGY_TYPES, ADDITIONAL_TYPES } from "./constants";

const HeatingBillPreviewFour = ({
  previewData,
}: {
  previewData: HeatingBillPreviewData;
}) => {
  const periodStart = useMemo(() =>
    previewData.mainDocDates.start_date ? new Date(previewData.mainDocDates.start_date) : null
    , [previewData.mainDocDates.start_date]);

  const periodEnd = useMemo(() =>
    previewData.mainDocDates.end_date ? new Date(previewData.mainDocDates.end_date) : null
    , [previewData.mainDocDates.end_date]);

  const allLocalIds = useMemo(() => {
    return Array.from(new Set(previewData.contracts.map(c => c.local_id).filter(Boolean)));
  }, [previewData.contracts]);

  const { consumption: buildingConsumption } = useConsumptionData(
    allLocalIds,
    periodStart,
    periodEnd
  );

  const { consumption: unitConsumption, meters: unitMeters } = useConsumptionData(
    previewData.localId,
    periodStart,
    periodEnd
  );

  const costCalculations = useMemo(() => {
    const energyInvoices = previewData.invoices.filter(inv =>
      ENERGY_TYPES.some(t => inv.cost_type?.toLowerCase().includes(t))
    );
    const energySum = energyInvoices.reduce((s, i) => s + Number(i.total_amount || 0), 0);

    const additionalInvoices = previewData.invoices.filter(inv =>
      ADDITIONAL_TYPES.some(t => inv.cost_type?.toLowerCase().includes(t))
    );
    const additionalSum = additionalInvoices.reduce((s, i) => s + Number(i.total_amount || 0), 0);
    const energyAndHeatingSum = energySum + additionalSum;



    // Consumption is in final units (MWh for heat, m³ for water)
    const totalEnergyMWh = buildingConsumption.heat;
    const totalWaterHotm3 = buildingConsumption.waterHot;

    // warmWaterEnergy is calculated in kWh (Formula: 2.5 * V * dT / 1.15)
    // We convert it to MWh to calculate the percentage against totalEnergyMWh
    const warmWaterEnergykWh = totalWaterHotm3 > 0 ? (2.5 * totalWaterHotm3 * 50) / 1.15 : 0;
    const warmWaterEnergyMWh = warmWaterEnergykWh / 1000;

    const warmWaterPercent = totalEnergyMWh > 0 ? (warmWaterEnergyMWh / totalEnergyMWh) * 100 : 0;
    const warmWaterBaseCosts = (energyAndHeatingSum * warmWaterPercent) / 100;

    const wwGeräteMiete = previewData.invoices.find(inv =>
      inv.cost_type?.toLowerCase().includes("gerätemiete") &&
      previewData.costCategories.find(c => c.type === inv.cost_type)?.allocation_key?.toLowerCase().includes("warmwasser")
    );
    const totalWarmWaterCosts = warmWaterBaseCosts + Number(wwGeräteMiete?.total_amount || 0);

    const hGeräteMiete = previewData.invoices.find(inv =>
      inv.cost_type?.toLowerCase().includes("gerätemiete") &&
      previewData.costCategories.find(c => c.type === inv.cost_type)?.allocation_key?.toLowerCase().includes("heizung")
    );
    const totalHeatingCosts = (energyAndHeatingSum - warmWaterBaseCosts) + Number(hGeräteMiete?.total_amount || 0);

    const unitArea = previewData.unitArea;
    const livingSpaceShare = Number(previewData.mainDocData?.living_space_share || 30);
    const consumptionShare = Number(previewData.mainDocData?.consumption_dependent || 70);

    // Individual Heating
    const heatGrundkosten = (totalHeatingCosts * livingSpaceShare / 100) / (previewData.totalLivingSpace || 1) * unitArea;
    const heatVerbrauchskosten = (totalHeatingCosts * consumptionShare / 100) / ((totalEnergyMWh - warmWaterEnergyMWh) || 1) * (unitConsumption.heat);

    // Individual Warmwater
    const wwGrundkosten = (totalWarmWaterCosts * livingSpaceShare / 100) / (previewData.totalLivingSpace || 1) * unitArea;
    const wwVerbrauchskosten = (totalWarmWaterCosts * consumptionShare / 100) / (totalWaterHotm3 || 1) * (unitConsumption.waterHot);

    // Coldwater calculation (similar to Page 3)
    const getKwSum = (type: string) =>
      previewData.invoices
        .filter(inv => inv.cost_type?.toLowerCase().includes(type.toLowerCase()))
        .reduce((sum, inv) => sum + Number(inv.total_amount || 0), 0);

    const kwCosts = {
      kaltwasser: getKwSum("Kaltwasser"),
      abwasser: getKwSum("Abwasser"),
      geraetmiete: getKwSum("Gerätemiete Kaltwasser"),
      abrechnung: getKwSum("Abrechnung Kaltwasser"),
    };

    const buildingKwConsumption = buildingConsumption.waterCold;
    const unitKwConsumption = unitConsumption.waterCold;

    const kwRates = {
      kaltwasser: buildingKwConsumption > 0 ? kwCosts.kaltwasser / buildingKwConsumption : 0,
      abwasser: buildingKwConsumption > 0 ? kwCosts.abwasser / buildingKwConsumption : 0,
      geraetmiete: buildingKwConsumption > 0 ? kwCosts.geraetmiete / buildingKwConsumption : 0,
      abrechnung: (previewData.contracts.length > 0) ? kwCosts.abrechnung / previewData.contracts.length : 0,
    };

    const individualKwShare = (unitKwConsumption * kwRates.kaltwasser) +
      (unitKwConsumption * kwRates.abwasser) +
      (unitKwConsumption * kwRates.geraetmiete) +
      kwRates.abrechnung;

    const totalAmount = heatGrundkosten + heatVerbrauchskosten + wwGrundkosten + wwVerbrauchskosten + individualKwShare;

    return {
      heating: {
        grund: heatGrundkosten,
        verbrauch: heatVerbrauchskosten,
        rateGrund: (totalHeatingCosts * livingSpaceShare / 100) / (previewData.totalLivingSpace || 1),
        rateVerbrauch: (totalHeatingCosts * consumptionShare / 100) / ((totalEnergyMWh - warmWaterEnergyMWh) || 1),
      },
      warmwater: {
        grund: wwGrundkosten,
        verbrauch: wwVerbrauchskosten,
        rateGrund: (totalWarmWaterCosts * livingSpaceShare / 100) / (previewData.totalLivingSpace || 1),
        rateVerbrauch: (totalWarmWaterCosts * consumptionShare / 100) / (totalWaterHotm3 || 1),
      },
      coldwater: {
        total: individualKwShare,
        details: kwCosts,
        rates: kwRates,
        consumption: unitKwConsumption
      },
      unitArea,
      totalAmount
    };
  }, [previewData, buildingConsumption, unitConsumption]);

  const groupedMeters = useMemo(() => {
    return {
      heat: unitMeters.filter(m => ["Heat", "WMZ Rücklauf", "Heizkostenverteiler", "Wärmemengenzähler"].includes(m.type)),
      hot: unitMeters.filter(m => ["WWater", "Warmwasserzähler"].includes(m.type)),
      cold: unitMeters.filter(m => ["Water", "Kaltwasserzähler"].includes(m.type)),
    };
  }, [unitMeters]);

  return (
    <HeatingBillPreviewFourView
      previewData={previewData}
      data={{
        buildingConsumption,
        unitConsumption,
        costCalculations,
        groupedMeters
      }}
    />
  );
};

export default HeatingBillPreviewFour;


