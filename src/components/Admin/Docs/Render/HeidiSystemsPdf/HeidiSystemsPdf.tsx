"use client";

import { Document } from "@react-pdf/renderer";
import HeatingBillPreviewFivePDF from "./HeatingBillPreviewFivePDF";
import HeatingBillPreviewOnePDF from "./HeatingBillPreviewOnePDF";
import HeatingBillPreviewTwoPDF from "./HeatingBillPreviewTwoPDF";
import HeatingBillPreviewThreePDF from "./HeatingBillPreviewThreePDF";
import HeatingBillPreviewFourPDF from "./HeatingBillPreviewFourPDF";
import HeatingBillPreviewSixPDF from "./HeatingBillPreviewSixPDF";
import { HeatingBillPreviewProps } from "../HeatingBillPreview/HeatingBillPreview";
import { HeatingBillPreviewData } from "../HeatingBillPreview/types";
import { generateHeidiCustomerNumber, generatePropertyNumber } from "@/utils";
import { differenceInMonths, max, min } from "date-fns";
import { useConsumptionData } from "@/hooks/useConsumptionData";
import { useMemo } from "react";

export default function HeidiSystemsPdf(props: HeatingBillPreviewProps) {
  const {
    mainDoc,
    user,
    objekt,
    contracts,
    invoices,
    totalLivingSpace,
    costCategories,
    local,
  } = props;

  const periodStart = mainDoc?.start_date
    ? new Date(mainDoc.start_date)
    : new Date();
  const periodEnd = mainDoc?.end_date ? new Date(mainDoc.end_date) : new Date();

  const filteredContracts = contracts.filter((contract) => {
    if (!contract.rental_start_date || !contract.rental_end_date) return false;
    const rentalEnd = new Date(contract.rental_end_date);
    return rentalEnd <= periodEnd;
  });

  const totalContractsAmount = filteredContracts?.reduce((acc, contract) => {
    const rentalStart = new Date(contract.rental_start_date!);
    const rentalEnd = new Date(contract.rental_end_date!);

    const overlapStart = max([rentalStart, periodStart]);
    const overlapEnd = min([rentalEnd, periodEnd]);

    let overlapMonths = differenceInMonths(overlapEnd, overlapStart) + 1;
    if (overlapMonths < 0) overlapMonths = 0;

    return acc + overlapMonths * Number(contract.additional_costs ?? 0);
  }, 0);

  const totalAmount = invoices.reduce(
    (sum, invoice) => sum + Number(invoice.total_amount ?? 0),
    0
  );

  const totalDiff = totalContractsAmount - totalAmount;

  const contractors = contracts.flatMap((contract) => contract.contractors);

  const previewData: HeatingBillPreviewData = {
    mainDocDates: {
      created_at: mainDoc?.created_at,
      start_date: mainDoc?.start_date,
      end_date: mainDoc?.end_date,
    },
    mainDocData: mainDoc,
    userInfo: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
    },
    objektInfo: {
      zip: objekt?.zip || "",
      street: objekt?.street || "",
    },
    contractorsNames: contractors
      ?.map((c) => `${c.first_name} ${c.last_name}`)
      .join(", "),
    totalInvoicesAmount: invoices.reduce(
      (sum, invoice) => sum + Number(invoice.total_amount ?? 0),
      0
    ),
    totalLivingSpace,
    contracts,
    totalDiff,
    invoices,
    costCategories,
    propertyNumber: generatePropertyNumber(),
    heidiCustomerNumber: generateHeidiCustomerNumber(),
    localId: local?.id,
    unitArea: Number(local?.living_space || 0),
  };

  const allLocalIds = useMemo(() => {
    return Array.from(new Set(contracts.map(c => c.local_id).filter(Boolean)));
  }, [contracts]);

  const { consumption: buildingConsumption } = useConsumptionData(
    allLocalIds,
    periodStart,
    periodEnd
  );

  const { consumption: unitConsumption, meters: unitMeters } = useConsumptionData(
    local?.id,
    periodStart,
    periodEnd
  );

  const costCalculations = useMemo(() => {
    const energyTypes = ["fernwärme", "brennstoff", "heizöl", "gas", "preisbremse", "nahwärme"];
    const energyInvoices = invoices.filter(inv =>
      energyTypes.some(t => inv.cost_type?.toLowerCase().includes(t))
    );
    const energySum = energyInvoices.reduce((s, i) => s + Number(i.total_amount || 0), 0);

    const additionalTypes = ["wartung", "strom", "bedienung", "emissionsmessung", "reinigung"];
    const additionalInvoices = invoices.filter(inv =>
      additionalTypes.some(t => inv.cost_type?.toLowerCase().includes(t))
    );
    const additionalSum = additionalInvoices.reduce((s, i) => s + Number(i.total_amount || 0), 0);
    const energyAndHeatingSum = energySum + additionalSum;

    // Consumption Data is already in final units (MWh for heat, m³ for water)
    const totalEnergyMWh = buildingConsumption.heat;
    const totalWaterHotm3 = buildingConsumption.waterHot;

    // Formula produces kWh: 2.5 * V(m³) * DeltaT(K) / 1.15
    const warmWaterEnergykWh = totalWaterHotm3 > 0 ? (2.5 * totalWaterHotm3 * 50) / 1.15 : 0;
    const warmWaterEnergyMWh = warmWaterEnergykWh / 1000;

    const warmWaterPercent = totalEnergyMWh > 0 ? (warmWaterEnergyMWh / totalEnergyMWh) * 100 : 0;
    const warmWaterBaseCosts = (energyAndHeatingSum * warmWaterPercent) / 100;

    const wwGeräteMiete = invoices.find(inv =>
      inv.cost_type?.toLowerCase().includes("gerätemiete") &&
      costCategories.find(c => c.type === inv.cost_type)?.allocation_key?.toLowerCase().includes("warmwasser")
    );
    const totalWarmWaterCosts = warmWaterBaseCosts + Number(wwGeräteMiete?.total_amount || 0);

    const hGeräteMiete = invoices.find(inv =>
      inv.cost_type?.toLowerCase().includes("gerätemiete") &&
      costCategories.find(c => c.type === inv.cost_type)?.allocation_key?.toLowerCase().includes("heizung")
    );
    const totalHeatingCosts = (energyAndHeatingSum - warmWaterBaseCosts) + Number(hGeräteMiete?.total_amount || 0);

    const unitArea = Number(local?.living_space || 0);
    const livingSpaceShare = Number(mainDoc?.living_space_share || 30);
    const consumptionShare = Number(mainDoc?.consumption_dependent || 70);

    // Individual Heating
    const heatGrundkosten = (totalHeatingCosts * livingSpaceShare / 100) / (totalLivingSpace || 1) * unitArea;
    const heatVerbrauchskosten = (totalHeatingCosts * consumptionShare / 100) / ((totalEnergyMWh - warmWaterEnergyMWh) || 1) * (unitConsumption.heat);

    // Individual Warmwater
    const wwGrundkosten = (totalWarmWaterCosts * livingSpaceShare / 100) / (totalLivingSpace || 1) * unitArea;
    const wwVerbrauchskosten = (totalWarmWaterCosts * consumptionShare / 100) / (totalWaterHotm3 || 1) * (unitConsumption.waterHot);

    // Coldwater calculation (similar to Page 3)
    const getKwSum = (type: string) =>
      invoices
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
      abrechnung: (contracts.length > 0) ? kwCosts.abrechnung / contracts.length : 0,
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
        rateGrund: (totalHeatingCosts * livingSpaceShare / 100) / (totalLivingSpace || 1),
        rateVerbrauch: (totalHeatingCosts * consumptionShare / 100) / ((totalEnergyMWh - warmWaterEnergyMWh) || 1),
      },
      warmwater: {
        grund: wwGrundkosten,
        verbrauch: wwVerbrauchskosten,
        rateGrund: (totalWarmWaterCosts * livingSpaceShare / 100) / (totalLivingSpace || 1),
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
  }, [buildingConsumption, unitConsumption, invoices, costCategories, mainDoc, totalLivingSpace, local, contracts]);

  const groupedMeters = useMemo(() => {
    return {
      heat: unitMeters.filter(m => ["Heat", "WMZ Rücklauf", "Heizkostenverteiler", "Wärmemengenzähler"].includes(m.type)),
      hot: unitMeters.filter(m => ["WWater", "Warmwasserzähler"].includes(m.type)),
      cold: unitMeters.filter(m => ["Water", "Kaltwasserzähler"].includes(m.type)),
    };
  }, [unitMeters]);

  const calculationData = {
    buildingConsumption,
    unitConsumption,
    costCalculations,
    groupedMeters
  };

  return (
    // <PDFViewer width={"100%"} height={"100%"}>
    <Document>
      <HeatingBillPreviewOnePDF
        previewData={previewData}
        contractors={contractors}
      />
      <HeatingBillPreviewTwoPDF previewData={previewData} data={calculationData} />
      <HeatingBillPreviewThreePDF previewData={previewData} data={calculationData} />
      <HeatingBillPreviewFourPDF previewData={previewData} data={calculationData} />
      <HeatingBillPreviewFivePDF previewData={previewData} />
      <HeatingBillPreviewSixPDF previewData={previewData} />
    </Document>
    // </PDFViewer>
  );
}
