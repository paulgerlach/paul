import { Document } from "@react-pdf/renderer";
import HeatingBillPreviewFivePDF from "./HeatingBillPreviewFivePDF";
import HeatingBillPreviewOnePDF from "./HeatingBillPreviewOnePDF";
import HeatingBillPreviewTwoPDF from "./HeatingBillPreviewTwoPDF";
import HeatingBillPreviewThreePDF from "./HeatingBillPreviewThreePDF";
import HeatingBillPreviewFourPDF from "./HeatingBillPreviewFourPDF";
import HeatingBillPreviewSixPDF from "./HeatingBillPreviewSixPDF";
import type { HeatingBillPdfModel } from "@/lib/heating-bill/types";

export default function HeidiSystemsPdf({
  model,
}: {
  model: HeatingBillPdfModel;
}) {
  return (
    <Document>
      <HeatingBillPreviewOnePDF cover={model.cover} />
      <HeatingBillPreviewTwoPDF buildingCalc={model.buildingCalc} cover={model.cover} />
      <HeatingBillPreviewThreePDF coldWater={model.coldWater} cover={model.cover} />
      <HeatingBillPreviewFourPDF unitBreakdown={model.unitBreakdown} cover={model.cover} />
      <HeatingBillPreviewFivePDF co2={model.co2} cover={model.cover} />
      <HeatingBillPreviewSixPDF energySummary={model.energySummary} cover={model.cover} />
    </Document>
  );
}
