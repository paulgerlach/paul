"use client";

import { Document } from "@react-pdf/renderer";
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
import { differenceInMonths, max, min, parse } from "date-fns";

export default function HeidiSystemsPdf(props: HeatingBillPreviewProps) {
  const {
    mainDoc,
    user,
    objekt,
    contracts,
    invoices,
    totalLivingSpace,
    costCategories,
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
    contracts,
    totalDiff,
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
        contractors={contractors}
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
