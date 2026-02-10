import { Document } from "@react-pdf/renderer";
// import HeatingBillPreviewFivePDF from "./HeatingBillPreviewFivePDF";
import HeatingBillPreviewOnePDF from "./HeatingBillPreviewOnePDF";
import HeatingBillPreviewTwoPDF from "./HeatingBillPreviewTwoPDF";
// import HeatingBillPreviewThreePDF from "./HeatingBillPreviewThreePDF";
// import HeatingBillPreviewFourPDF from "./HeatingBillPreviewFourPDF";
// import HeatingBillPreviewSixPDF from "./HeatingBillPreviewSixPDF";
import type { CalculatedBillData } from "@/actions/generate/generateHeatingBillPDF";

export default function HeidiSystemsPdf({ data }: { data: CalculatedBillData }) {
  return (
    <Document>
      <HeatingBillPreviewOnePDF data={data} />
      <HeatingBillPreviewTwoPDF data={data} />
      {/* 
      <HeatingBillPreviewThreePDF previewData={previewData} />
      <HeatingBillPreviewFourPDF previewData={previewData} />
      <HeatingBillPreviewFivePDF previewData={previewData} />
      <HeatingBillPreviewSixPDF previewData={previewData} /> 
      */}
    </Document>
  );
}
