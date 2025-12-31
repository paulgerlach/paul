"use client";

import Image from "next/image";
import { admin_logo } from "@/static/icons";
import { type HeatingBillPreviewData } from "./HeatingBillPreview";
import { useConsumptionData } from "@/hooks/useConsumptionData";
import { formatEuro } from "@/utils";
import { useMemo } from "react";
import { HeatingBillPreviewThreeView } from "./HeatingBillPreviewThreeView";

const formatter = new Intl.NumberFormat("de-DE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 6,
});

interface HeatingBillPreviewThreeCalculated {
  buildingConsumption: any;
  unitConsumption: any;
  totalKaltwasserCosts: number;
  rates: {
    kaltwasser: number;
    abwasser: number;
    geraetmiete: number;
    abrechnung: number;
  };
  unitCosts: number;
  costs: {
    kaltwasser: number;
    abwasser: number;
    geraetmiete: number;
    abrechnung: number;
  };
}

const HeatingBillPreviewThree = ({
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

  const kwCalculations = useMemo(() => {
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

    const buildingKwConsumption = buildingConsumption.waterCold / 1000;

    const kwRates = {
      kaltwasser: buildingKwConsumption > 0 ? kwCosts.kaltwasser / buildingKwConsumption : 0,
      abwasser: buildingKwConsumption > 0 ? kwCosts.abwasser / buildingKwConsumption : 0,
      geraetmiete: buildingKwConsumption > 0 ? kwCosts.geraetmiete / buildingKwConsumption : 0,
      abrechnung: (previewData.contracts.length > 0) ? kwCosts.abrechnung / previewData.contracts.length : 0,
    };

    const totalKwCosts = kwCosts.kaltwasser + kwCosts.abwasser + kwCosts.geraetmiete + kwCosts.abrechnung;
    const totalRate = kwRates.kaltwasser + kwRates.abwasser + kwRates.geraetmiete;

    return { kwCosts, kwRates, sums: { totalKwCosts, totalRate } };
  }, [previewData.invoices, buildingConsumption.waterCold, previewData.contracts.length]);

  return (
    <HeatingBillPreviewThreeView
      previewData={previewData}
      data={{
        buildingConsumption,
        kwCosts: kwCalculations.kwCosts,
        kwRates: kwCalculations.kwRates,
        sums: kwCalculations.sums,
      }}
    />
  );
};

export default HeatingBillPreviewThree;
