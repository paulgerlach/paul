"use client";

import { Document, PDFViewer } from "@react-pdf/renderer";
import HeatingBillPreviewFivePDF from "./HeatingBillPreviewFivePDF";
import HeatingBillPreviewOnePDF from "./HeatingBillPreviewOnePDF";
import HeatingBillPreviewTwoPDF from "./HeatingBillPreviewTwoPDF";
import HeatingBillPreviewThreePDF from "./HeatingBillPreviewThreePDF";
import HeatingBillPreviewFourPDF from "./HeatingBillPreviewFourPDF";
import HeatingBillPreviewSixPDF from "./HeatingBillPreviewSixPDF";
import {
  type HeatingBillPreviewData,
  type HeatingBillPreviewProps,
} from "../HeatingBillPreview/HeatingBillPreview";
import { generateHeidiCustomerNumber, generatePropertyNumber } from "@/utils";

export default function HeidiSystemsPdf(props: HeatingBillPreviewProps) {
  const {
    mainDoc,
    user,
    objekt,
    contractors,
    contract,
    invoices,
    totalLivingSpace,
    costCategories,
  } = props;
  const previewData: HeatingBillPreviewData = {
    mainDocDates: {
      created_at: mainDoc?.created_at,
      start_date: mainDoc?.start_date,
      end_date: mainDoc?.end_date,
    },
    mainDocData: mainDoc,
    userInfo: {
      first_name: user?.first_name,
      last_name: user?.last_name,
    },
    objektInfo: {
      zip: objekt?.zip,
      street: objekt?.street,
    },
    contractorsNames: contractors
      ?.map((c) => `${c.first_name} ${c.last_name}`)
      .join(", "),
    totalInvoicesAmount: invoices.reduce(
      (sum, invoice) => sum + Number(invoice.total_amount ?? 0),
      0
    ),
    totalLivingSpace,
    contract,
    invoices,
    costCategories,
    propertyNumber: generatePropertyNumber(),
    heidiCustomerNumber: generateHeidiCustomerNumber(),
  };

  return (
    // <PDFViewer width={"100%"} height={"100%"}>
    <Document>
      <HeatingBillPreviewOnePDF
        previewData={previewData}
        contractors={props.contractors}
      />
      <HeatingBillPreviewTwoPDF previewData={previewData} />
      <HeatingBillPreviewThreePDF previewData={previewData} />
      <HeatingBillPreviewFourPDF previewData={previewData} />
      <HeatingBillPreviewFivePDF previewData={previewData} />
      <HeatingBillPreviewSixPDF previewData={previewData} />
    </Document>
    // </PDFViewer>
  );
}
