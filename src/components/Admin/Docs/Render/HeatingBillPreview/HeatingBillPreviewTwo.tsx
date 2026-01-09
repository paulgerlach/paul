"use client";

import { type HeatingBillPreviewData } from "./types";
import { useMemo } from "react";
import { useConsumptionData } from "@/hooks/useConsumptionData";

import { HeatingBillPreviewTwoView } from "./HeatingBillPreviewTwoView";

const HeatingBillPreviewTwo = ({
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

  console.log("buildingConsumption", buildingConsumption);

  const costGroups = useMemo(() => {
    const energy: any[] = [];
    const additional: any[] = [];
    const separate: any[] = [];

    const energyTypes = ["fernwärme", "brennstoff", "heizöl", "gas", "preisbremse", "nahwärme"];
    const separateTypes = ["kaltwasser", "abwasser", "gerätemiete", "zählermiete", "abrechnung kaltwasser"];

    previewData.invoices.forEach(inv => {
      const type = (inv.cost_type || "").toLowerCase();
      if (energyTypes.some(t => type.includes(t))) {
        energy.push(inv);
      } else if (separateTypes.some(t => type.includes(t))) {
        separate.push(inv);
      } else {
        additional.push(inv);
      }
    });

    return { energy, additional, separate };
  }, [previewData.invoices]);

  const sums = useMemo(() => {
    const energySum = costGroups.energy.reduce((s, i) => s + Number(i.total_amount || 0), 0);
    const additionalSum = costGroups.additional.reduce((s, i) => s + Number(i.total_amount || 0), 0);
    const separateSum = costGroups.separate.reduce((s, i) => s + Number(i.total_amount || 0), 0);

    const energyAndHeatingSum = energySum + additionalSum;
    const grandTotal = energyAndHeatingSum + separateSum;

    return { energySum, additionalSum, separateSum, energyAndHeatingSum, grandTotal };
  }, [costGroups]);

  const thermal = useMemo(() => {
    const totalEnergykWh = buildingConsumption.heat / 1000;
    const totalWaterHotm3 = buildingConsumption.waterHot / 1000;
    const warmWaterEnergykWh = totalWaterHotm3 > 0 ? (2.5 * totalWaterHotm3 * 50) / 1.15 : 0;
    const warmWaterPercent = totalEnergykWh > 0 ? (warmWaterEnergykWh / totalEnergykWh) * 100 : 0;
    const energyAndHeatingSum = sums.energyAndHeatingSum;
    const warmWaterBaseCosts = (energyAndHeatingSum * warmWaterPercent) / 100;

    const warmWaterGeräteMiete = costGroups.separate.find(inv =>
      inv.cost_type?.toLowerCase().includes("gerätemiete") &&
      previewData.costCategories.find(c => c.type === inv.cost_type)?.allocation_key?.toLowerCase().includes("warmwasser")
    );
    const warmWaterGeräteAmount = Number(warmWaterGeräteMiete?.total_amount || 0);
    const totalWarmWaterCosts = warmWaterBaseCosts + warmWaterGeräteAmount;

    const heatingGeräteMiete = costGroups.separate.find(inv =>
      inv.cost_type?.toLowerCase().includes("gerätemiete") &&
      previewData.costCategories.find(c => c.type === inv.cost_type)?.allocation_key?.toLowerCase().includes("heizung")
    );
    const heatingGeräteAmount = Number(heatingGeräteMiete?.total_amount || 0);
    const remainingHeatingEnergyCosts = energyAndHeatingSum - warmWaterBaseCosts;
    const totalHeatingCosts = remainingHeatingEnergyCosts + heatingGeräteAmount;

    return {
      totalEnergykWh,
      totalWaterHotm3,
      warmWaterEnergykWh,
      warmWaterPercent,
      warmWaterBaseCosts,
      warmWaterGeräteAmount,
      totalWarmWaterCosts,
      heatingGeräteAmount,
      remainingHeatingEnergyCosts,
      totalHeatingCosts,
    };
  }, [buildingConsumption, sums, costGroups, previewData.costCategories]);

  return (
    <HeatingBillPreviewTwoView
      previewData={previewData}
      data={{
        buildingConsumption,
        costGroups,
        sums,
        thermal,
      }}
    />
  );
};

export default HeatingBillPreviewTwo;
