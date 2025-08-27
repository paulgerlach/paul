"use client";

import { Document, PDFViewer } from "@react-pdf/renderer";
import HeatingBillPreviewFivePDF from "./HeatingBillPreviewFivePDF";
import HeatingBillPreviewOnePDF from "./HeatingBillPreviewOnePDF";
import HeatingBillPreviewTwoPDF from "./HeatingBillPreviewTwoPDF";
import HeatingBillPreviewThreePDF from "./HeatingBillPreviewThreePDF";
import HeatingBillPreviewFourPDF from "./HeatingBillPreviewFourPDF";
import HeatingBillPreviewSixPDF from "./HeatingBillPreviewSixPDF";
import type { ContractorType, ContractType } from "@/types";

export default function HeidiSystemsPdf() {
  const stubbedPreviewData = {
    mainDocDates: {
      created_at: "14.11.2024",
      start_date: "01.01.2023",
      end_date: "31.12.2023",
    },
    userInfo: { first_name: "Braun &", last_name: "Hubertus GmbH" },
    objektInfo: { street: "Rungestr. 21", zip: "10179 Berlin" },
    contractorsNames: "Heidi Systems GmbH",
    totalInvoicesAmount: 0,
    totalLivingSpace: 0,
    contract: {
      id: "stub-id",
      user_id: "stub-user-id",
      local_id: "stub-local-id",
      is_current: false,
      rental_start_date: "2023-01-01",
      rental_end_date: null,
      cold_rent: "1000.00",
      additional_costs: "200.00",
      deposit: "1000.00",
      custody_type: null,
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z",
    } as ContractType,
    costCategories: [],
  };

  const stubbedContractors: ContractorType[] = [];

  return (
    <PDFViewer width={"100%"} height={"100%"}>
      <Document>
        {/* <HeatingBillPreviewOnePDF
          previewData={stubbedPreviewData}
          contractors={stubbedContractors}
        />
        <HeatingBillPreviewTwoPDF previewData={stubbedPreviewData} />
        <HeatingBillPreviewThreePDF previewData={stubbedPreviewData} />
        <HeatingBillPreviewFourPDF previewData={stubbedPreviewData} />
        <HeatingBillPreviewFivePDF previewData={stubbedPreviewData} />
        <HeatingBillPreviewSixPDF previewData={stubbedPreviewData} /> */}
      </Document>
    </PDFViewer>
  );
}
