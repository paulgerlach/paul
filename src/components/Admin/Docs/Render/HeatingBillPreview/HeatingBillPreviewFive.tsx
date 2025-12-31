import { type HeatingBillPreviewData } from "./HeatingBillPreview";
import { useMemo } from "react";
import { useConsumptionData } from "@/hooks/useConsumptionData";
import { HeatingBillPreviewFiveView } from "./HeatingBillPreviewFiveView";

const HeatingBillPreviewFive = ({
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
    return Array.from(new Set(previewData.contracts.map((c: any) => c.local_id).filter(Boolean))) as string[];
  }, [previewData.contracts]);

  const { consumption: buildingConsumption } = useConsumptionData(
    allLocalIds,
    periodStart,
    periodEnd
  );

  const totalHeatingkWh = buildingConsumption.heat / 1000;

  // TODO: Fetch emission factor from settings/data or using the standard 0.210 if not available
  const co2EmissionFactor = 0.210;
  const co2Emission = totalHeatingkWh * co2EmissionFactor;

  // TODO: Fetch actual CO2 costs from invoices or calculate using standard price
  // For now using the hardcoded ratio from the example if invoices not available
  const co2Cost = 14318.13; // Placeholder

  const co2Data = {
    co2Consumption: totalHeatingkWh,
    co2Emission: co2Emission,
    co2Cost: co2Cost,
    buildingLivingSpace: previewData.totalLivingSpace || 11196.4,
    co2EmissionFactor,
    co2EmissionPerSqm: (co2Emission / (previewData.totalLivingSpace || 1)),
    tenantSharePercent: 90, // TODO: logic based on table
    landlordSharePercent: 10,
    unitCostDetails: {
      tenant: 126.60,
      landlord: 14.08,
      total: 140.68,
    }
  };

  return (
    <HeatingBillPreviewFiveView
      previewData={previewData}
      data={co2Data}
    />
  );
};

export default HeatingBillPreviewFive;
