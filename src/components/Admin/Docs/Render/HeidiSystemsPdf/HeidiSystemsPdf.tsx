"use client";

import { Document, PDFViewer } from "@react-pdf/renderer";
// import HeatingBillPreviewFivePDF from "./HeatingBillPreviewFivePDF";
// import HeatingBillPreviewOnePDF from "./HeatingBillPreviewOnePDF";
// import HeatingBillPreviewTwoPDF from "./HeatingBillPreviewTwoPDF";
// import HeatingBillPreviewThreePDF from "./HeatingBillPreviewThreePDF";
// import HeatingBillPreviewFourPDF from "./HeatingBillPreviewFourPDF";
// import HeatingBillPreviewSixPDF from "./HeatingBillPreviewSixPDF";

export default function HeidiSystemsPdf() {
  return (
    <PDFViewer width={"100%"} height={"100%"}>
      <Document>
        {/* <HeatingBillPreviewOnePDF /> */}
        {/* <HeatingBillPreviewTwoPDF />
        <HeatingBillPreviewThreePDF />
        <HeatingBillPreviewFourPDF />
        <HeatingBillPreviewFivePDF />
        <HeatingBillPreviewSixPDF /> */}
      </Document>
    </PDFViewer>
  );
}
