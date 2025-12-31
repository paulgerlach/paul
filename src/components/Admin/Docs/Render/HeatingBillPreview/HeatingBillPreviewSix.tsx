import { useMemo } from "react";
import { useConsumptionData } from "@/hooks/useConsumptionData";
import { type HeatingBillPreviewData } from "./HeatingBillPreview";
import { HeatingBillPreviewSixView } from "./HeatingBillPreviewSixView";

const HeatingBillPreviewSix = ({
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

  const { consumption: unitConsumption } = useConsumptionData(
    previewData.localId,
    periodStart,
    periodEnd
  );

  const energyConsumptionTotal = buildingConsumption.heat / 1000;
  const unitHeatingConsumption = unitConsumption.heat / 1000;
  const unitWaterConsumption = unitConsumption.waterHot / 1000;

  // Calculate warm water energy for unit (approximate if not metered directly in kWh)
  // Formula from Page 4: warmWaterEnergykWh = totalWaterHotm3 > 0 ? (2.5 * totalWaterHotm3 * 50) / 1.15 : 0;
  // unitConsumption.waterHot is in Liters? Page 4 says / 1000 -> m3.
  const unitWaterHotm3 = unitConsumption.waterHot / 1000;
  const unitWarmWaterEnergykWh = unitWaterHotm3 > 0 ? (2.5 * unitWaterHotm3 * 50) / 1.15 : 0;
  // Use calculated energy for warm water consumption value
  const finalUnitWaterConsumption = unitWarmWaterEnergykWh;

  const unitTotalConsumption = unitHeatingConsumption + finalUnitWaterConsumption;
  const unitLivingSpace = previewData.unitArea || 1;
  const unitConsumptionPerSqm = unitTotalConsumption / unitLivingSpace;

  const totalLivingSpace = previewData.totalLivingSpace || 1;
  const buildingAvgConsumptionPerSqm = energyConsumptionTotal / totalLivingSpace;

  const heatingData = [
    {
      name: "Vorjahr", // Placeholder for previous year
      vorjahreszeitraum: 0,
      aktuellerZeitraum: 0,
    },
    {
      name: "Aktuell",
      vorjahreszeitraum: 0,
      aktuellerZeitraum: unitHeatingConsumption,
      witterungsbereinigt: unitHeatingConsumption * 1.1, // Mock climatic correction
    },
  ];

  const waterData = [
    { name: "Vorjahr", vorjahreszeitraum: 0 },
    { name: "Aktuell", vorjahreszeitraum: finalUnitWaterConsumption }, // Using correct key for single bar? or maybe 'aktuellerZeitraum'
  ];
  // View expects 'vorjahreszeitraum'? Wait, view has <Bar dataKey="vorjahreszeitraum" />. It seems to show only 1 bar in the second chart in the code I extracted?
  // Let's check View code for water chart. 
  // <Bar dataKey="vorjahreszeitraum" ... name="Vorjahreszeitraum" />
  // It seems the label is "Vorjahreszeitraum" but maybe it's meant to be current?
  // The original code had: { name: "01.01.2023 - 31.12.2023", vorjahreszeitraum: 1534 }
  // So 'vorjahreszeitraum' key is used for both! That seems like a bug in original or just confusing naming.
  // I will stick to 'vorjahreszeitraum' key for now to match View.

  const calculatedData = {
    energySource: "Nah-/Fernwärme",
    energyConsumptionTotal: energyConsumptionTotal,
    co2EmissionFactor: 0.21010,
    co2EmissionTotal: energyConsumptionTotal * 0.21010,
    unitHeatingConsumption: unitHeatingConsumption,
    unitWaterConsumption: finalUnitWaterConsumption,
    unitTotalConsumption: unitTotalConsumption,
    unitLivingSpace: unitLivingSpace,
    unitConsumptionPerSqm: unitConsumptionPerSqm,
    avgConsumptionPerSqm: 92.9, // Benchmark value (hardcoded)
    buildingAvgConsumptionPerSqm: buildingAvgConsumptionPerSqm,
    heatingData,
    waterData
  };

  return (
    <HeatingBillPreviewSixView
      previewData={previewData}
      data={calculatedData}
    />
  );
};

export default HeatingBillPreviewSix;
