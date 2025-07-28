"use client";

import { Document } from "@react-pdf/renderer";
import HeatingBillPreviewFivePDF from "./HeatingBillPreviewFivePDF";
import HeatingBillPreviewOnePDF from "./HeatingBillPreviewOnePDF";
import HeatingBillPreviewTwoPDF from "./HeatingBillPreviewTwoPDF";
import HeatingBillPreviewThreePDF from "./HeatingBillPreviewThreePDF";
import HeatingBillPreviewFourPDF from "./HeatingBillPreviewFourPDF";
import HeatingBillPreviewSixPDF from "./HeatingBillPreviewSixPDF";

export default function HeidiSystemsPdf() {
  return (
    <Document>
      <HeatingBillPreviewOnePDF />
      <HeatingBillPreviewTwoPDF />
      <HeatingBillPreviewThreePDF />
      <HeatingBillPreviewFourPDF />
      <HeatingBillPreviewFivePDF />
      <HeatingBillPreviewSixPDF />
    </Document>
  );
}
