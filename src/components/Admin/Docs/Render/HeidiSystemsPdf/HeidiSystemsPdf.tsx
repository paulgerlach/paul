import { Document } from "@react-pdf/renderer";
import HeatingBillPreviewFivePDF from "./HeatingBillPreviewFivePDF";
import HeatingBillPreviewOnePDF from "./HeatingBillPreviewOnePDF";
import HeatingBillPreviewThreePDF from "./HeatingBillPreviewThreePDF";
import HeatingBillPreviewFourPDF from "./HeatingBillPreviewFourPDF";
import HeatingBillPreviewSixPDF from "./HeatingBillPreviewSixPDF";
import type { HeatingBillPdfModel } from "@/app/api/heating-bill/_lib";
import HeatingBillPreviewTwoPDF from "@/components/Admin/Docs/Render/HeidiSystemsPdf/HeatingBillPreviewTwoPDF";

export default function HeidiSystemsPdf({
  model,
}: {
  model: HeatingBillPdfModel;
}) {
  const logo = model.logoSrc ?? "/admin_logo.png";
  return (
    <Document>
      <HeatingBillPreviewOnePDF cover={model.cover} logoSrc={logo} />
      <HeatingBillPreviewTwoPDF buildingCalc={model.buildingCalc} cover={model.cover} logoSrc={logo} />
      <HeatingBillPreviewThreePDF coldWater={model.coldWater} cover={model.cover} logoSrc={logo} />
      <HeatingBillPreviewFourPDF unitBreakdown={model.unitBreakdown} cover={model.cover} logoSrc={logo} />
      <HeatingBillPreviewFivePDF co2={model.co2} cover={model.cover} logoSrc={logo} />
      <HeatingBillPreviewSixPDF energySummary={model.energySummary} cover={model.cover} logoSrc={logo} />
    </Document>
  );
}
